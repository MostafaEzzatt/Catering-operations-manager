import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const cutomersTable = pgTable("co-mgr-customers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  code: varchar({ length: 255 }).notNull(),
  cNumber: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
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
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  },
);

export const auditLogs = pgTable("audit_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user: text().notNull(),
  action: text().notNull(), // CREATE | UPDATE | DELETE
  entity: text().notNull(), // posts, projects, tasks etc
  entityId: text(),
  metadata: jsonb(), // optional extra info
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
