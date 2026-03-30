import LogsClient from "@/components/logs-client";
import { db } from "@/drizzle";
import { auditLogs, cutomersTable } from "@/drizzle/db/schema";
import { desc } from "drizzle-orm";

const Logs = async () => {
  const [logs, allUsersResult, customers] = await Promise.all([
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)),
    db.selectDistinct({ user: auditLogs.user }).from(auditLogs),
    db.select({ id: cutomersTable.id, name: cutomersTable.name }).from(cutomersTable),
  ]);

  const users = allUsersResult.map((u) => u.user);

  return (
    <main className="container mx-auto">
      <LogsClient logs={logs} users={users} customers={customers} />
    </main>
  );
};

export default Logs;
