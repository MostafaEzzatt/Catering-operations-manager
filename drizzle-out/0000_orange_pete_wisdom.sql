CREATE TABLE "co-mgr-customer-flight-count" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "co-mgr-customer-flight-count_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"customerId" integer NOT NULL,
	"count" integer NOT NULL,
	"date" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "co-mgr-customers" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "co-mgr-customers_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "co-mgr-customer-flight-count" ADD CONSTRAINT "co-mgr-customer-flight-count_customerId_co-mgr-customers_id_fk" FOREIGN KEY ("customerId") REFERENCES "public"."co-mgr-customers"("id") ON DELETE cascade ON UPDATE no action;