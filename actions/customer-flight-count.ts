/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCount(
  prevState: any,
  value: CustomerFlightCountFormValues,
) {
  try {
    const customer: typeof customerFlightCountTable.$inferInsert = {
      ...value,
      date: value.date.toDateString(),
    };

    await db.insert(customerFlightCountTable).values(customer).returning();

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}

export async function deleteCount(prevState: any, value: number) {
  try {
    await db
      .delete(customerFlightCountTable)
      .where(eq(customerFlightCountTable.id, value));

    revalidatePath("/");
    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}
