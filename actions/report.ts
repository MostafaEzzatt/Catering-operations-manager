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

const transformDataToMonthly = (
  data: {
    date: Date;
    customer: string;
    flightCount: number;
    c: number;
    h: number;
    y: number;
  }[],
) => {
  const monthlyMap = new Map();

  data.forEach((item) => {
    const dateObj = new Date(item.date);

    // 1. Format date as "February 2026"
    const monthYear = dateObj.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });

    // 2. Create a unique key using Month + Year + Customer
    const groupKey = `${monthYear}-${item.customer}`;

    if (!monthlyMap.has(groupKey)) {
      monthlyMap.set(groupKey, {
        date: monthYear, // Now looks like "February 2026"
        customer: item.customer,
        flightCount: 0,
        c: 0,
        h: 0,
        y: 0,
      });
    }

    const current = monthlyMap.get(groupKey);
    current.flightCount += item.flightCount;
    current.c += item.c;
    current.h += item.h;
    current.y += item.y;
  });

  return Array.from(monthlyMap.values());
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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
        eq(customerFlightCountTable.customerId, parsed.data.companyId),
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

    const response = request
      .map((i) => ({
        date: new Date(i["co-mgr-customer-flight-count"].date),
        customer: i["co-mgr-customers"]?.name as string,
        flightCount: i["co-mgr-customer-flight-count"].flightCount,
        c: i["co-mgr-customer-flight-count"].c,
        h: i["co-mgr-customer-flight-count"].h,
        y: i["co-mgr-customer-flight-count"].y,
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return parsed.data.monthFormat
      ? ({
          error: false,
          response: transformDataToMonthly(response),
        } as reportType)
      : ({
          error: false,
          response: response.map((i) => ({ ...i, date: formatDate(i.date) })),
        } as reportType);
  } catch (error) {
    console.error("Report failed:", error);
    return { error: true, response: [] } as reportType;
  }
}
