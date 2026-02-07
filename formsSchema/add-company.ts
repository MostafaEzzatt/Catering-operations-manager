import z from "zod";

export const formSchema = z.object({
  name: z.string().min(1, "خطاء فى اسم الشركة"),
  code: z.string().min(1, "خطاء فى كود الشركة"),
});
