import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "Company name is required at least 1 character"),
  code: z.string().min(1, "Company name is required at least 1 character"),
});
