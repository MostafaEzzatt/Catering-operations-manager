/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { actionSchema } from "@/formsSchema/report-flights";
import { auth } from "@clerk/nextjs/server";
import { and, between, eq, inArray, not } from "drizzle-orm";

// EgyptAir (MS) companies are identified by this cNumber; "foreign" reports
// (companyType "1") exclude them
const MS_COMPANY_C_NUMBER = "077";

type ReportRow = {
  date: Date;
  customer: string;
  flightCount: number;
  c: number;
  h: number;
  y: number;
};

// Company names are Arabic, so compare them with Arabic collation
const byCompany = (a: { customer: string }, b: { customer: string }) =>
  a.customer.localeCompare(b.customer, "ar");

// Flight-count dates are "YYYY-MM-DD" strings, which new Date() reads as UTC
// midnight, so every label is built in UTC. Using the server's local timezone
// could shift a date into the previous day, month or year.
const periodLabel = (date: Date, period: "month" | "year") =>
  period === "year"
    ? String(date.getUTCFullYear()) // "2026"
    : // Arabic month name with Western digits: "فبراير 2026"
      date.toLocaleString("ar-EG-u-nu-latn", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });

// Start of the month / year a date falls in, used to order the groups
const periodStart = (date: Date, period: "month" | "year") =>
  Date.UTC(
    date.getUTCFullYear(),
    period === "year" ? 0 : date.getUTCMonth(),
    1,
  );

// Sums each company's rows per month or year, ordered by period and then by
// company name inside each period.
const groupByPeriod = (
  data: ReportRow[],
  period: "month" | "year",
): reportResponseType[] => {
  const groups = new Map<
    string,
    { start: number; row: reportResponseType }
  >();

  for (const item of data) {
    const start = periodStart(item.date, period);
    const key = `${start}-${item.customer}`;

    let group = groups.get(key);
    if (!group) {
      group = {
        start,
        row: {
          date: periodLabel(item.date, period),
          customer: item.customer,
          flightCount: 0,
          c: 0,
          h: 0,
          y: 0,
        },
      };
      groups.set(key, group);
    }

    group.row.flightCount += item.flightCount;
    group.row.c += item.c;
    group.row.h += item.h;
    group.row.y += item.y;
  }

  return Array.from(groups.values())
    .sort((a, b) => a.start - b.start || byCompany(a.row, b.row))
    .map((g) => g.row);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  })
    .format(date)
    .replace(/\//g, " / "); // Adds the spaces around the slashes
};

export async function reportAction(prevState: any, value: reportForm) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return { error: true, response: [] } as reportType;

  // The client form validates too, but server actions are callable directly
  const parsed = actionSchema.safeParse(value);
  if (!parsed.success) return { error: true, response: [] } as reportType;

  try {
    const dateRange = between(
      customerFlightCountTable.date,
      parsed.data.from,
      parsed.data.to,
    );

    let customerType = dateRange;
    if (parsed.data.companyType == "0") {
      customerType = and(
        dateRange,
        inArray(customerFlightCountTable.customerId, parsed.data.companyIds),
      )!;
    } else if (parsed.data.companyType == "1") {
      const MS = await db
        .select({ id: cutomersTable.id })
        .from(cutomersTable)
        .where(eq(cutomersTable.cNumber, MS_COMPANY_C_NUMBER));

      // No MS company means every company counts as foreign
      if (MS.length > 0) {
        customerType = and(
          dateRange,
          not(
            inArray(
              customerFlightCountTable.customerId,
              MS.map((m) => m.id),
            ),
          ),
        )!;
      }
    }

    const request = await db
      .select()
      .from(customerFlightCountTable)
      .where(customerType)
      .leftJoin(
        cutomersTable,
        eq(customerFlightCountTable.customerId, cutomersTable.id),
      );

    const response: ReportRow[] = request
      .map((i) => ({
        date: new Date(i["co-mgr-customer-flight-count"].date),
        customer: i["co-mgr-customers"]?.name as string,
        flightCount: i["co-mgr-customer-flight-count"].flightCount,
        c: i["co-mgr-customer-flight-count"].c,
        h: i["co-mgr-customer-flight-count"].h,
        y: i["co-mgr-customer-flight-count"].y,
      }))
      // Oldest day first, companies alphabetical within a day
      .sort((a, b) => a.date.getTime() - b.date.getTime() || byCompany(a, b));
    const records =
      parsed.data.period === "day"
        ? response.map((i) => ({ ...i, date: formatDate(i.date) }))
        : groupByPeriod(response, parsed.data.period);

    return { error: false, response: records } as reportType;
  } catch (error) {
    console.error("Report failed:", error);
    return { error: true, response: [] } as reportType;
  }
}
