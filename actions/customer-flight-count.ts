/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

export async function addCount(
  prevState: any,
  value: CustomerFlightCountFormValues,
) {
  try {
    const customer: typeof customerFlightCountTable.$inferInsert = {
      ...value,
      date: value.date,
    };

    const CHECK_EXIST = await db
      .select()
      .from(customerFlightCountTable)
      .where(
        and(
          eq(customerFlightCountTable.date, customer.date),
          eq(customerFlightCountTable.customerId, customer.customerId),
        ),
      );

    if (CHECK_EXIST.length >= 1) {
      return 2;
    }

    const INSERT_DATA = await db
      .insert(customerFlightCountTable)
      .values(customer)
      .returning();

    revalidatePath("/");

    await logAction({
      action: "CREATE",
      entity: "Flight Details",
      entityId: `${INSERT_DATA[0].id}`,
      metadata: INSERT_DATA[0],
    });

    return 1;
  } catch (error) {
    console.error("Insertion failed:", error);
    return 0;
  }
}

export async function deleteCount(prevState: any, value: number) {
  try {
    const SelectData = await db
      .select()
      .from(customerFlightCountTable)
      .where(eq(customerFlightCountTable.id, value));

    await db
      .delete(customerFlightCountTable)
      .where(eq(customerFlightCountTable.id, value));

    revalidatePath("/");

    await logAction({
      action: "DELETE",
      entity: "Flight Details",
      entityId: `${value}`,
      metadata: SelectData[0],
    });

    return true;
  } catch (error) {
    console.error("Insertion failed:", error);
    return false;
  }
}
