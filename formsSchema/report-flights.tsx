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

// What the server action actually receives: the client serializes the dates
// to strings (toDateString) before calling reportAction
export const actionSchema = z
  .object({
    from: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
    to: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
    monthFormat: z.boolean(),
    companyType: z.enum(["0", "1", "2"]),
    companyId: z.number().int(),
  })
  .refine((data) => Date.parse(data.from) <= Date.parse(data.to))
  .refine((data) => data.companyType !== "0" || data.companyId >= 1);
