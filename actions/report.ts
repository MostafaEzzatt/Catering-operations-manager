/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { actionSchema } from "@/formsSchema/report-flights";
import { auth } from "@clerk/nextjs/server";
import { and, between, desc, eq, inArray, not } from "drizzle-orm";

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

// Flight-count dates are "YYYY-MM-DD" strings, which new Date() reads as UTC
// midnight, so every label is built in UTC. Using the server's local timezone
// could shift a date into the previous day, month or year.
const periodLabel = (date: Date, period: "month" | "year") =>
  period === "year"
    ? String(date.getUTCFullYear()) // "2026"
    : date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }); // "February 2026"

// Sums each company's rows per month or year. Rows arrive sorted by date, so
// the groups come out in chronological order.
const groupByPeriod = (
  data: ReportRow[],
  period: "month" | "year",
): reportResponseType[] => {
  const groups = new Map<string, reportResponseType>();

  for (const item of data) {
    const label = periodLabel(item.date, period);
    const key = `${label}-${item.customer}`;

    let group = groups.get(key);
    if (!group) {
      group = {
        date: label,
        customer: item.customer,
        flightCount: 0,
        c: 0,
        h: 0,
        y: 0,
      };
      groups.set(key, group);
    }

    group.flightCount += item.flightCount;
    group.c += item.c;
    group.h += item.h;
    group.y += item.y;
  }

  return Array.from(groups.values());
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
      )
      .orderBy(desc(customerFlightCountTable.createdAt));

    const response: ReportRow[] = request
      .map((i) => ({
        date: new Date(i["co-mgr-customer-flight-count"].date),
        customer: i["co-mgr-customers"]?.name as string,
        flightCount: i["co-mgr-customer-flight-count"].flightCount,
        c: i["co-mgr-customer-flight-count"].c,
        h: i["co-mgr-customer-flight-count"].h,
        y: i["co-mgr-customer-flight-count"].y,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
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
