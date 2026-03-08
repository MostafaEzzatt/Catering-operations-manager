import { db } from "@/drizzle";
import { auditLogs } from "@/drizzle/db/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function logAction({
  action,
  entity,
  entityId,
  metadata,
}: {
  action: "CREATE" | "UPDATE" | "DELETE";
  entity: string;
  entityId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}) {
  const userData = await currentUser();
  const user = userData?.username;
  if (!user) return;

  await db.insert(auditLogs).values({
    user,
    action,
    entity,
    entityId,
    metadata,
  });
}
