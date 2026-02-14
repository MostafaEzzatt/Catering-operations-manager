/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { and, between, desc, eq, inArray, not } from "drizzle-orm";

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
  try {
    const MS = value.allComp.find((e) => e.cNumber == "077");
    const customerType =
      value.companyType == "0"
        ? and(
            between(customerFlightCountTable.date, value.from, value.to),
            eq(customerFlightCountTable.customerId, value.companyId),
          )
        : value.companyType == "1"
          ? and(
              between(customerFlightCountTable.date, value.from, value.to),
              not(inArray(customerFlightCountTable.customerId, [MS?.id || 1])),
            )
          : between(customerFlightCountTable.date, value.from, value.to);

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
    return value.monthFormat
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
