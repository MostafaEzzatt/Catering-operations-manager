"use server";
import { db } from "@/drizzle";
import { auditLogs } from "@/drizzle/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function logAction({
  action,
  entity,
  entityId,
  metadata,
}: {
  action: "CREATE" | "UPDATE" | "DELETE" | "REQUEST_DELETE" | "REJECT_DELETE";
  entity: string;
  entityId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) {
  try {
    const userData = await currentUser();
    // Fall back to email/id so actions are still logged for users without a username
    const user =
      userData?.username ??
      userData?.primaryEmailAddress?.emailAddress ??
      userData?.id;
    if (!user) return;

    await db.insert(auditLogs).values({
      user,
      action,
      entity,
      entityId,
      metadata,
    });
  } catch (error) {
    console.error(
      "Something went wrong while trying to log action",
      { action, entity, entityId, metadata },
      error,
    );
  }
}
