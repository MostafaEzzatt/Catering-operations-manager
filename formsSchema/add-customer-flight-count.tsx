import { isDayString, todayDayString } from "@/lib/date-range";
import z from "zod";

const wholeNumber = "يجب ان يكون رقم صحيح";

export const formSchema = z.object({
  customerId: z.number().int(wholeNumber).min(1, "الشركة غير صحيحة"),
  flightCount: z
    .number()
    .int(wholeNumber)
    .min(1, "عدد الرحلات يجب ان يكون 1 او اكثر"),
  c: z.number().int(wholeNumber).min(0),
  h: z.number().int(wholeNumber).min(0),
  y: z.number().int(wholeNumber).min(0),
  // "YYYY-MM-DD", a real calendar day, and not after today (Cairo time)
  date: z
    .string()
    .refine(isDayString, { message: "التاريخ غير صحيح", abort: true })
    .refine((d) => d <= todayDayString(), {
      message: "لا يمكن اضافة اعداد لتاريخ مستقبلى",
    }),
});

export const updateFormSchema = formSchema.pick({
  flightCount: true,
  c: true,
  h: true,
  y: true,
});
