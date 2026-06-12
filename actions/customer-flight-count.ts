/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable } from "@/drizzle/db/schema";
import {
  formSchema,
  updateFormSchema,
} from "@/formsSchema/add-customer-flight-count";
import { canModifyRecord } from "@/lib/permissions";
import { getSession } from "@/lib/roles";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

export async function addCount(
  prevState: any,
  value: CustomerFlightCountFormValues,
) {
  const { isAuthenticated, userId } = await getSession();
  if (!isAuthenticated) return 0;

  // The client form validates too, but server actions are callable directly
  const parsed = formSchema.safeParse(value);
  if (!parsed.success) return 0;

  try {
    const customer: typeof customerFlightCountTable.$inferInsert = {
      ...parsed.data,
      createdBy: userId,
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
    // 23505 = Postgres unique violation: another request inserted the same
    // customer/date between our existence check and the insert
    if ((error as { code?: string })?.code === "23505") return 2;

    console.error("Insertion failed:", error);
    return 0;
  }
}

// 0 = error, 1 = updated, 2 = record not found, 3 = not allowed
export async function updateCount(
  prevState: any,
  value: UpdateFlightCountFormValues & { id: number },
) {
  const { isAuthenticated, isAdmin, userId } = await getSession();
  if (!isAuthenticated) return 0;

  // The client form validates too, but server actions are callable directly
  const parsed = updateFormSchema.safeParse(value);
  if (!parsed.success || !Number.isInteger(value.id)) return 0;

  try {
    const SelectData = await db
      .select()
      .from(customerFlightCountTable)
      .where(eq(customerFlightCountTable.id, value.id));

    if (SelectData.length === 0) return 2;

    if (!canModifyRecord(SelectData[0].createdBy, { isAdmin, userId }))
      return 3;

    const UpdatedData = await db
      .update(customerFlightCountTable)
      .set({
        flightCount: parsed.data.flightCount,
        c: parsed.data.c,
        h: parsed.data.h,
        y: parsed.data.y,
        updatedAt: new Date(),
      })
      .where(eq(customerFlightCountTable.id, value.id))
      .returning();

    // The row can vanish between the permission check and the update
    if (UpdatedData.length === 0) return 2;

    revalidatePath("/");

    await logAction({
      action: "UPDATE",
      entity: "Flight Details",
      entityId: `${UpdatedData[0].id}`,
      metadata: UpdatedData[0],
    });

    return 1;
  } catch (error) {
    console.error("Update failed:", error);
    return 0;
  }
}

export async function deleteCount(prevState: any, value: number) {
  const { isAuthenticated, isAdmin, userId } = await getSession();
  if (!isAuthenticated) return false;

  try {
    const SelectData = await db
      .select()
      .from(customerFlightCountTable)
      .where(eq(customerFlightCountTable.id, value));

    if (SelectData.length === 0) return false;

    if (!canModifyRecord(SelectData[0].createdBy, { isAdmin, userId }))
      return false;

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
