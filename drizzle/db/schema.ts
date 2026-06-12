import {
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const cutomersTable = pgTable(
  "co-mgr-customers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
    cNumber: varchar({ length: 255 }).notNull(),
    // Set when a regular user requests deletion; the company is only deleted
    // once an admin approves (admin delete clears it implicitly)
    deleteRequestedBy: varchar({ length: 255 }),
    deleteRequestedAt: timestamp(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  // The actions check uniqueness before writing, but only these constraints
  // close the race between concurrent requests (handled via error code 23505)
  (t) => [
    unique("customers_name_unique").on(t.name),
    unique("customers_code_unique").on(t.code),
    unique("customers_cnumber_unique").on(t.cNumber),
  ],
);

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
    // Clerk user id of who entered the record; null for rows that predate
    // role support, which only admins can delete
    createdBy: varchar({ length: 255 }),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp()
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [unique("customer_flight_count_customer_date_unique").on(t.customerId, t.date)],
);

export const auditLogs = pgTable("audit_logs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user: text().notNull(),
  action: text().notNull(), // CREATE | UPDATE | DELETE
  entity: text().notNull(), // posts, projects, tasks etc
  entityId: text(),
  metadata: jsonb().$type<logTableMetaDataType>(), // optional extra info
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
