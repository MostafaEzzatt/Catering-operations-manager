import LogsClient from "@/components/logs-client";
import NotAllowed from "@/components/not-allowed";
import { db } from "@/drizzle";
import { auditLogs, cutomersTable } from "@/drizzle/db/schema";
import { getSession } from "@/lib/roles";
import { desc } from "drizzle-orm";

const LOGS_PER_PAGE = 10;

const Logs = async () => {
  // Unlisted page: reachable only by direct link, but still requires sign-in
  const { isAuthenticated } = await getSession();
  if (!isAuthenticated) return <NotAllowed />;

  const [logs, allUsersResult, customers] = await Promise.all([
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)),
    db.selectDistinct({ user: auditLogs.user }).from(auditLogs),
    db
      .select({ id: cutomersTable.id, name: cutomersTable.name })
      .from(cutomersTable),
  ]);

  const users = allUsersResult.map((u) => u.user);

  return (
    <main className="container mx-auto">
      <LogsClient
        logs={logs}
        users={users}
        customers={customers}
        logsPerPage={LOGS_PER_PAGE}
      />
    </main>
  );
};

export default Logs;
