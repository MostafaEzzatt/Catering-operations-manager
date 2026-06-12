// Shared by the server actions and the client table so the buttons shown in
// the UI always match what the server will allow. Keep it free of server-only
// imports (it runs in client components too).

// Admins may modify any record; regular users only records they created.
// Records with no creator (predating role support) are admin-only.
export function canModifyRecord(
  createdBy: string | null,
  session: { isAdmin: boolean; userId: string | null },
) {
  return (
    session.isAdmin ||
    (createdBy !== null &&
      session.userId !== null &&
      createdBy === session.userId)
  );
}
