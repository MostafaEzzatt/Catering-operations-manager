/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  try {
    const customer: typeof cutomersTable.$inferInsert = value;

    const INSERT_DATA = await db
      .insert(cutomersTable)
      .values(customer)
      .returning();

    revalidatePath("/add-companys");

    logAction({
      action: "CREATE",
      entity: "Company",
      entityId: `${INSERT_DATA[0].id}`,
      metadata: INSERT_DATA[0],
    });

    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}

export async function deleteCustomer(prevState: any, value: number) {
  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value));

    await db.delete(cutomersTable).where(eq(cutomersTable.id, value));

    revalidatePath("/add-companys");

    logAction({
      action: "DELETE",
      entity: "Company",
      entityId: `${SelectData[0].id}`,
      metadata: SelectData[0],
    });

    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}
