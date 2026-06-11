import z from "zod";

export const formSchema = z
  .object({
    from: z.date(),
    to: z.date(),
    monthFormat: z.boolean(),
    companyType: z.enum(["0", "1", "2"]),
    companyId: z.number(),
  })
  .refine((data) => data.companyType !== "0" || data.companyId >= 1, {
    message: "برجاء اختيار شركة",
    path: ["companyId"],
  });
