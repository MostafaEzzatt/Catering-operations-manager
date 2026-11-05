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
import { and, eq, InferSelectModel } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuditUser, logAction } from "@/lib/audit-log";

type FlightCountRow = InferSelectModel<typeof customerFlightCountTable>;

// status: 0 = error, 1 = added, 2 = already exists for that company and
// date (with the existing record, when known, so the form can offer to edit
// it), 3 = date malformed or in the future
type AddCountResult =
  | { status: 0 | 1 | 3 }
  | { status: 2; existing?: FlightCountRow };

export async function addCount(
  prevState: any,
  value: CustomerFlightCountFormValues,
): Promise<AddCountResult> {
  const { isAuthenticated, userId } = await getSession();
  if (!isAuthenticated) return { status: 0 };

  // The client form validates too, but server actions are callable directly
  const parsed = formSchema.safeParse(value);
  if (!parsed.success)
    return {
      status: parsed.error.issues.some((i) => i.path[0] === "date") ? 3 : 0,
    };

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
      return { status: 2, existing: CHECK_EXIST[0] };
    }

    const auditUser = await getAuditUser();

    // The insert and its audit entry are saved together or not at all
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(customerFlightCountTable)
        .values(customer)
        .returning();

      await logAction(tx, auditUser, {
        action: "CREATE",
        entity: "Flight Details",
        record: created,
      });
    });

    revalidatePath("/");

    return { status: 1 };
  } catch (error) {
    // 23505 = Postgres unique violation: another request inserted the same
    // customer/date between our existence check and the insert
    if ((error as { code?: string })?.code === "23505") return { status: 2 };

    console.error("Insertion failed:", error);
    return { status: 0 };
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

    const auditUser = await getAuditUser();

    // The update and its audit entry are saved together or not at all
    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(customerFlightCountTable)
        .set({
          flightCount: parsed.data.flightCount,
          c: parsed.data.c,
          h: parsed.data.h,
          y: parsed.data.y,
        })
        .where(eq(customerFlightCountTable.id, value.id))
        .returning();

      // The row can vanish between the permission check and the update
      if (!row) return null;

      await logAction(tx, auditUser, {
        action: "UPDATE",
        entity: "Flight Details",
        record: row,
      });
      return row;
    });

    if (!updated) return 2;

    revalidatePath("/");

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

    const auditUser = await getAuditUser();

    // The delete and its audit entry are saved together or not at all
    await db.transaction(async (tx) => {
      await tx
        .delete(customerFlightCountTable)
        .where(eq(customerFlightCountTable.id, value));

      await logAction(tx, auditUser, {
        action: "DELETE",
        entity: "Flight Details",
        record: SelectData[0],
      });
    });

    revalidatePath("/");

    return true;
  } catch (error) {
    console.error("Deletion failed:", error);
    return false;
  }
}
