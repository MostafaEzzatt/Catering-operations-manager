import { createPool } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { EnhancedQueryLogger } from "drizzle-query-logger";

// A real pool, not the `sql` helper from @vercel/postgres. Drizzle only pins a
// transaction to a single connection when the client is a VercelPool
// instance, and `sql` is a Proxy that fails that check: with it, BEGIN, the
// queries and COMMIT could each run on a different pooled connection.
// createPool() reads POSTGRES_URL, the same pool `sql` creates internally.
const pool = createPool();

// export const db = drizzle({ client: pool, logger: new EnhancedQueryLogger() });
export const db = drizzle({ client: pool, logger: false });
