import { cutomersTable } from "@/drizzle/db/schema";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";

export const selectCustomerSchema = createSelectSchema(cutomersTable);

export const formSchema = z.object({
  from: z.date(),
  to: z.date(),
  monthFormat: z.boolean(),
  companyType: z.enum(["0", "1", "2"]),
  companyId: z.number(),
  allComp: z.array(selectCustomerSchema),
});
