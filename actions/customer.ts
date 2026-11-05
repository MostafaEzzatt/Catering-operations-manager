/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { customerFlightCountTable, cutomersTable } from "@/drizzle/db/schema";
import { formSchema } from "@/formsSchema/add-company";
import { getSession } from "@/lib/roles";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  type AuditEntry,
  getAuditUser,
  logAction,
  logActions,
} from "@/lib/audit-log";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return 0;

  // The client form validates too, but server actions are callable directly
  const parsed = formSchema.safeParse(value);
  if (!parsed.success) return 0;

  try {
    const customer: typeof cutomersTable.$inferInsert = parsed.data;

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

    const auditUser = await getAuditUser();

    // The insert and its audit entry are saved together or not at all
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(cutomersTable)
        .values(customer)
        .returning();

      await logAction(tx, auditUser, {
        action: "CREATE",
        entity: "Company",
        record: created,
      });
    });

    revalidatePath("/add-companys");

    return 1;
  } catch (error) {
    // 23505 = Postgres unique violation: another request inserted the same
    // name/code/cNumber between our existence check and the insert
    if ((error as { code?: string })?.code === "23505") return 2;

    console.error("Insertion failed:", error);
    return 0;
  }
}

// 0 = error, 1 = deleted (admin), 2 = deletion request submitted for approval
export async function deleteCustomer(prevState: any, value: number) {
  const { isAuthenticated, isAdmin, userId } = await getSession();
  if (!isAuthenticated) return 0;

  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value));

    if (SelectData.length === 0) return 0;

    const auditUser = await getAuditUser();

    if (!isAdmin) {
      const user = await currentUser();

      // The request and its audit entry are saved together or not at all
      await db.transaction(async (tx) => {
        await tx
          .update(cutomersTable)
          .set({
            deleteRequestedBy: user?.username ?? userId,
            deleteRequestedAt: new Date(),
          })
          .where(eq(cutomersTable.id, value));

        await logAction(tx, auditUser, {
          action: "REQUEST_DELETE",
          entity: "Company",
          record: SelectData[0],
        });
      });

      revalidatePath("/add-companys");

      return 2;
    }

    // The delete and its audit entries are saved together or not at all
    const deleted = await db.transaction(async (tx) => {
      // Lock the company first. A flight count added for it by a concurrent
      // request then waits for this transaction (and fails once the company
      // is gone) instead of slipping in and being removed unlogged.
      const [company] = await tx
        .select()
        .from(cutomersTable)
        .where(eq(cutomersTable.id, value))
        .for("update");
      if (!company) return false;

      // Delete the company's flight counts explicitly, rather than leaving
      // them to the database's cascade, so each one gets its own log entry
      const removedCounts = await tx
        .delete(customerFlightCountTable)
        .where(eq(customerFlightCountTable.customerId, value))
        .returning();

      await tx.delete(cutomersTable).where(eq(cutomersTable.id, value));

      await logActions(tx, auditUser, [
        ...removedCounts.map(
          (record): AuditEntry => ({
            action: "DELETE",
            entity: "Flight Details",
            record,
          }),
        ),
        { action: "DELETE", entity: "Company", record: company },
      ]);
      return true;
    });

    if (!deleted) return 0;

    revalidatePath("/add-companys");
    // The home page lists the removed flight counts
    revalidatePath("/");

    return 1;
  } catch (error) {
    console.error("Deletion failed:", error);
    return 0;
  }
}

export async function rejectDeleteRequest(prevState: any, value: number) {
  const { isAdmin } = await getSession();
  if (!isAdmin) return false;

  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value));

    if (SelectData.length === 0 || !SelectData[0].deleteRequestedBy)
      return false;

    const auditUser = await getAuditUser();

    // The rejection and its audit entry are saved together or not at all
    await db.transaction(async (tx) => {
      await tx
        .update(cutomersTable)
        .set({ deleteRequestedBy: null, deleteRequestedAt: null })
        .where(eq(cutomersTable.id, value));

      await logAction(tx, auditUser, {
        action: "REJECT_DELETE",
        entity: "Company",
        record: SelectData[0],
      });
    });

    revalidatePath("/add-companys");

    return true;
  } catch (error) {
    console.error("Reject delete request failed:", error);
    return false;
  }
}

interface updateValue {
  id: number;
  name: string;
  cNumber: string;
  code: string;
}
// 0 = error, 1 = updated, 2 = record not found, 3 = duplicate company data
export async function updateCustomer(prevState: any, value: updateValue) {
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return 0;

  // The client form validates too, but server actions are callable directly
  const parsed = formSchema.safeParse(value);
  if (!parsed.success || !Number.isInteger(value.id)) return 0;

  try {
    const SelectData = await db
      .select()
      .from(cutomersTable)
      .where(eq(cutomersTable.id, value.id))
      .limit(1);

    if (SelectData.length === 0) {
      return 2;
    }

    // Renaming into another company's name/code/cNumber would defeat the
    // uniqueness check addCustomer does on insert
    const CHECK_EXIST = await db
      .select({ id: cutomersTable.id })
      .from(cutomersTable)
      .where(
        and(
          ne(cutomersTable.id, value.id),
          or(
            eq(cutomersTable.name, parsed.data.name),
            eq(cutomersTable.cNumber, parsed.data.cNumber),
            eq(cutomersTable.code, parsed.data.code),
          ),
        ),
      );

    if (CHECK_EXIST.length >= 1) {
      return 3;
    }

    const auditUser = await getAuditUser();

    // The update and its audit entry are saved together or not at all
    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(cutomersTable)
        .set({
          name: parsed.data.name,
          cNumber: parsed.data.cNumber,
          code: parsed.data.code,
        })
        .where(eq(cutomersTable.id, value.id))
        .returning();

      // The row can vanish between the existence check and the update
      if (!row) return null;

      await logAction(tx, auditUser, {
        action: "UPDATE",
        entity: "Company",
        record: row,
      });
      return row;
    });

    if (!updated) return 2;

    revalidatePath("/add-companys");

    return 1;
  } catch (error) {
    // 23505 = unique violation: a concurrent write claimed the same
    // name/code/cNumber between our duplicate check and the update
    if ((error as { code?: string })?.code === "23505") return 3;

    console.error("Update failed:", error);
    return 0;
  }
}
