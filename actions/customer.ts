/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { formSchema } from "@/formsSchema/add-company";
import { getSession } from "@/lib/roles";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, ne, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

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

    if (!isAdmin) {
      const user = await currentUser();

      await db
        .update(cutomersTable)
        .set({
          deleteRequestedBy: user?.username ?? userId,
          deleteRequestedAt: new Date(),
        })
        .where(eq(cutomersTable.id, value));

      revalidatePath("/add-companys");

      await logAction({
        action: "REQUEST_DELETE",
        entity: "Company",
        entityId: `${SelectData[0].id}`,
        metadata: SelectData[0],
      });

      return 2;
    }

    await db.delete(cutomersTable).where(eq(cutomersTable.id, value));

    revalidatePath("/add-companys");

    await logAction({
      action: "DELETE",
      entity: "Company",
      entityId: `${SelectData[0].id}`,
      metadata: SelectData[0],
    });

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

    await db
      .update(cutomersTable)
      .set({ deleteRequestedBy: null, deleteRequestedAt: null })
      .where(eq(cutomersTable.id, value));

    revalidatePath("/add-companys");

    await logAction({
      action: "REJECT_DELETE",
      entity: "Company",
      entityId: `${SelectData[0].id}`,
      metadata: SelectData[0],
    });

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

    const UpdatedData = await db
      .update(cutomersTable)
      .set({
        name: parsed.data.name,
        cNumber: parsed.data.cNumber,
        code: parsed.data.code,
      })
      .where(eq(cutomersTable.id, value.id))
      .returning();

    // The row can vanish between the existence check and the update
    if (UpdatedData.length === 0) return 2;

    revalidatePath("/add-companys");

    await logAction({
      action: "UPDATE",
      entity: "Company",
      entityId: `${UpdatedData[0].id}`,
      metadata: UpdatedData[0],
    });

    return 1;
  } catch (error) {
    // 23505 = unique violation: a concurrent write claimed the same
    // name/code/cNumber between our duplicate check and the update
    if ((error as { code?: string })?.code === "23505") return 3;

    console.error("Update failed:", error);
    return 0;
  }
}
