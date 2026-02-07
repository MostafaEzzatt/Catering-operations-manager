import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const cutomersTable = pgTable("co-mgr-customers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
});
