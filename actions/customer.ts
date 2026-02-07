/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  try {
    const customer: typeof cutomersTable.$inferInsert = value;

    await db.insert(cutomersTable).values(customer).returning();

    revalidatePath("/add-companys");
    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}

export async function deleteCustomer(prevState: any, value: number) {
  try {
    await db.delete(cutomersTable).where(eq(cutomersTable.id, value));

    revalidatePath("/add-companys");
    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}
