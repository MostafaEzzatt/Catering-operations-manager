// Deliberately NOT a "use server" file. Every export of a "use server" file
// becomes a public HTTP endpoint, which would let any signed-in user write
// arbitrary audit rows. "server-only" makes the build fail if this module is
// ever imported into client code. Only server actions should call it.
import "server-only";

import type { db } from "@/drizzle";
import {
  auditLogs,
  customerFlightCountTable,
  cutomersTable,
} from "@/drizzle/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { InferSelectModel } from "drizzle-orm";

type CompanyRow = InferSelectModel<typeof cutomersTable>;
type FlightCountRow = InferSelectModel<typeof customerFlightCountTable>;

// The `tx` handed to a db.transaction() callback
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// Every audit entry records the one row it is about. Each entity only accepts
// its own table's row and the actions that exist for it, so a call cannot log
// mismatched data. The entry's entityId is always the row's id.
export type AuditEntry =
  | {
      entity: "Company";
      action: "CREATE" | "UPDATE" | "DELETE" | "REQUEST_DELETE" | "REJECT_DELETE";
      record: CompanyRow;
    }
  | {
      entity: "Flight Details";
      action: "CREATE" | "UPDATE" | "DELETE";
      record: FlightCountRow;
    };

// Who the audit entry is attributed to. Resolve it BEFORE opening the
// transaction: it is a network call to Clerk, and a transaction should not
// hold its database connection open while waiting on it.
export async function getAuditUser(): Promise<string> {
  const userData = await currentUser();
  // Fall back to email/id so actions are still logged for users without a username
  const user =
    userData?.username ??
    userData?.primaryEmailAddress?.emailAddress ??
    userData?.id;
  if (!user) throw new Error("Cannot attribute the audit entry to a user");
  return user;
}

// Writes the audit entry inside the caller's transaction. Errors are NOT
// caught on purpose: a failed audit write rolls the whole change back, so a
// change is never saved without its audit entry.
export async function logAction(
  tx: DbTransaction,
  user: string,
  { action, entity, record }: AuditEntry,
) {
  // jsonb stores the row as JSON, which turns its Date fields into ISO
  // strings. Converting here makes the stored value match its type.
  const metadata = JSON.parse(JSON.stringify(record)) as logStoredMetadata;

  await tx.insert(auditLogs).values({
    user,
    action,
    entity,
    entityId: String(record.id),
    metadata,
  });
}
