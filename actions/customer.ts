/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return 0;

  try {
    const customer: typeof cutomersTable.$inferInsert = value;

    const CHECK_EXIST = await db
      .select()
      .from(cutomersTable)
      .where(
        or(
          eq(cutomersTable.name, customer.name),
          eq(cutomersTable.cNumber, customer.cNumber),
          eq(cutomersTable.code, customer.code),
        ),
      );

    if (CHECK_EXIST.length >= 1) {
      return 2;
    }

    const INSERT_DATA = await db
      .insert(cutomersTable)
      .values(customer)
      .returning();

    revalidatePath("/add-companys");

    await logAction({
      action: "CREATE",
      entity: "Company",
      entityId: `${INSERT_DATA[0].id}`,
      metadata: INSERT_DATA[0],
    });

    return 1;
  } catch (error) {
    console.error("Insertion failed:", error);
    return 0;
  }
}

export async function deleteCustomer(prevState: any, value: number) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return false;

  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value));

    await db.delete(cutomersTable).where(eq(cutomersTable.id, value));

    revalidatePath("/add-companys");

    await logAction({
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

interface updateValue {
  id: number;
  name: string;
  cNumber: string;
  code: string;
}
export async function updateCustomer(prevState: any, value: updateValue) {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return 0;

  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value.id))
      .limit(1);

    if (SelectData.length === 0) {
      return 2;
    }

    await db
      .update(cutomersTable)
      .set({ name: value.name, cNumber: value.cNumber, code: value.code })
      .where(eq(cutomersTable.id, value.id));

    revalidatePath("/add-companys");

    await logAction({
      action: "UPDATE",
      entity: "Company",
      entityId: `${SelectData[0].id}`,
      metadata: SelectData[0],
    });

    return 1;
  } catch (error) {
    console.error("Update failed:", error);
    return 0;
  }
}
