import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
// import { EnhancedQueryLogger } from "drizzle-query-logger";

// export const db = drizzle({ client: sql, logger: new EnhancedQueryLogger() });
export const db = drizzle({ client: sql, logger: true });
