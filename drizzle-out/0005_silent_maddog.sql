ALTER TABLE "co-mgr-customers" ADD CONSTRAINT "customers_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "co-mgr-customers" ADD CONSTRAINT "customers_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "co-mgr-customers" ADD CONSTRAINT "customers_cnumber_unique" UNIQUE("cNumber");