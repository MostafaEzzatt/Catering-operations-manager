import { sql } from "drizzle-orm";
import { date, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const cutomersTable = pgTable("co-mgr-customers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 255 }).notNull(),
  cNumber: varchar({ length: 255 }).notNull(),
  createdAt: date()
    .notNull()
    .default(sql`CURRENT_DATE`),
  updatedAt: date()
    .notNull()
    .default(sql`CURRENT_DATE`),
});

export const customerFlightCountTable = pgTable(
  "co-mgr-customer-flight-count",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    customerId: integer("customerId")
      .references(() => cutomersTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    flightCount: integer().notNull(),
    c: integer().default(0).notNull(),
    h: integer().default(0).notNull(),
    y: integer().default(0).notNull(),
    date: date().notNull(),
    createdAt: date()
      .notNull()
      .default(sql`CURRENT_DATE`),
    updatedAt: date()
      .notNull()
      .default(sql`CURRENT_DATE`),
  },
);
