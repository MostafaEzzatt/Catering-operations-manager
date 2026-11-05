import z from "zod";

// How report rows are grouped: one row per entry, or totals per month / year
// for each company
export const REPORT_PERIODS = ["day", "month", "year"] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

// Dates are compared by calendar day only, which is what the server receives
const dayValue = (d: Date) => Date.parse(d.toDateString());

export const formSchema = z
  .object({
    from: z.date(),
    to: z.date(),
    period: z.enum(REPORT_PERIODS),
    companyType: z.enum(["0", "1", "2"]),
    // Companies picked for a "specific companies" report (companyType "0")
    companyIds: z.array(z.number().int().positive()),
  })
  .refine((data) => dayValue(data.from) <= dayValue(data.to), {
    message: "تاريخ البداية يجب ان يكون قبل تاريخ النهاية",
    path: ["to"],
  })
  .refine((data) => data.companyType !== "0" || data.companyIds.length >= 1, {
    message: "برجاء اختيار شركة واحدة على الاقل",
    path: ["companyIds"],
  });

// What the server action actually receives: the client serializes the dates
// to strings (toDateString) before calling reportAction
export const actionSchema = z
  .object({
    from: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
    to: z.string().refine((s) => !Number.isNaN(Date.parse(s))),
    period: z.enum(REPORT_PERIODS),
    companyType: z.enum(["0", "1", "2"]),
    // Capped so a direct call cannot send an unbounded IN (...) list
    companyIds: z.array(z.number().int().positive()).max(1000),
  })
  .refine((data) => Date.parse(data.from) <= Date.parse(data.to))
  .refine((data) => data.companyType !== "0" || data.companyIds.length >= 1);
