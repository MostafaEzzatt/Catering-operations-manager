import z from "zod";

export const formSchema = z.object({
  customerId: z.number().min(1, "الشركة غير صحيحة"),
  count: z.number().min(1, "عدد الرحلات يجب ان يكون 1 او اكثر"),
  date: z.date(),
});
