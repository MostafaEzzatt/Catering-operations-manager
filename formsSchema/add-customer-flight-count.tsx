import { isDayString, todayDayString } from "@/lib/date-range";
import z from "zod";

const wholeNumber = "يجب ان يكون رقم صحيح";
const tooBig = "الرقم كبير جدا";

// Far above any real day (largest so far: 135 flights, ~20k meals), but it
// catches extra digits typed by mistake and keeps values inside the int column
const MAX_COUNT = 1_000_000;

const flightCountNumber = z
  .number({
    error: (issue) =>
      issue.input === undefined ? "عدد الرحلات مطلوب" : wholeNumber,
  })
  .int(wholeNumber)
  .min(1, "عدد الرحلات يجب ان يكون 1 او اكثر")
  .max(MAX_COUNT, tooBig);

const mealCountNumber = z
  .number({ error: wholeNumber })
  .int(wholeNumber)
  .min(0, wholeNumber)
  .max(MAX_COUNT, tooBig);

// What the server actions accept: counts as numbers
export const formSchema = z.object({
  customerId: z.number().int(wholeNumber).min(1, "الشركة غير صحيحة"),
  flightCount: flightCountNumber,
  c: mealCountNumber,
  h: mealCountNumber,
  y: mealCountNumber,
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

// Arabic phone keyboards type Arabic-Indic (٠-٩) or Persian (۰-۹) digits
function toAsciiDigits(text: string) {
  return text
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

// Only plain digits make a number ("1.5", "1e3" and "-2" become NaN, which
// fails validation); an empty box becomes `empty`
function textToCount(empty: number | undefined) {
  return (value: string) => {
    const text = toAsciiDigits(value.trim());
    if (text === "") return empty;
    return /^\d+$/.test(text) ? Number(text) : NaN;
  };
}

// What the forms validate: the count boxes are text inputs (so a box can be
// empty), parsed into numbers with the same rules as above. An empty flight
// count is an error; an empty meal box counts as 0.
export const formTextSchema = formSchema.extend({
  flightCount: z.string().transform(textToCount(undefined)).pipe(flightCountNumber),
  c: z.string().transform(textToCount(0)).pipe(mealCountNumber),
  h: z.string().transform(textToCount(0)).pipe(mealCountNumber),
  y: z.string().transform(textToCount(0)).pipe(mealCountNumber),
});

export const updateFormTextSchema = formTextSchema.pick({
  flightCount: true,
  c: true,
  h: true,
  y: true,
});
