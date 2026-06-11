/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/drizzle";
import { cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";
import { currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { logAction } from "./log";

export async function addCustomer(prevState: any, value: CompanyFormValues) {
  const { isAuthenticated } = await getSession();
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
export async function updateCustomer(prevState: any, value: updateValue) {
  const { isAuthenticated } = await getSession();
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

    const UpdatedData = await db
      .update(cutomersTable)
      .set({ name: value.name, cNumber: value.cNumber, code: value.code })
      .where(eq(cutomersTable.id, value.id))
      .returning();

    revalidatePath("/add-companys");

    await logAction({
      action: "UPDATE",
      entity: "Company",
      entityId: `${UpdatedData[0].id}`,
      metadata: UpdatedData[0],
    });

    return 1;
  } catch (error) {
    console.error("Update failed:", error);
    return 0;
  }
}
