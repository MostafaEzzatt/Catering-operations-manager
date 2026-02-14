import z from "zod";

export const formSchema = z.object({
  customerId: z.number().min(1, "الشركة غير صحيحة"),
  flightCount: z.number().min(1, "عدد الرحلات يجب ان يكون 1 او اكثر"),
  c: z.number().min(0),
  h: z.number().min(0),
  y: z.number().min(0),
  date: z.string(),
});
