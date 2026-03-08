CREATE TABLE "audit_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user" text NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entityId" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
