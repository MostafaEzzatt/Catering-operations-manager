/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  try {
    const customer: typeof cutomersTable.$inferInsert = value;

    await db.insert(cutomersTable).values(customer).returning();

    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}
