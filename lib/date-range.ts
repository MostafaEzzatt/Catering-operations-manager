// Day strings are "YYYY-MM-DD", the format of the flight-count `date` column.
// In that format, plain string comparison gives date order.

// "This month" follows Cairo time, not the server's clock (UTC on Vercel), so
// the default range turns over at local midnight on the 1st
const TIME_ZONE = "Africa/Cairo";

export type DayRange = { from: string; to: string };

export function isDayString(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const d = new Date(`${value}T00:00:00Z`);
  // Rejects impossible dates such as 2026-02-30, which Date rolls over
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// "YYYY-MM-DD" → "DD / MM / YYYY", the format the reports use. Show it inside
// <bdi dir="ltr">: on a right-to-left page the parts would otherwise appear
// in reverse order.
export function formatDayString(day: string): string {
  const [year, month, dayOfMonth] = day.split("-");
  return `${dayOfMonth} / ${month} / ${year}`;
}

// Today's date in Cairo, as "YYYY-MM-DD"
export function todayDayString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

// First to last day of the current month
export function currentMonthRange(now = new Date()): DayRange {
  const [year, month] = todayDayString(now).split("-").map(Number);
  // Day 0 of the next month is the last day of this one
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();

  const mm = String(month).padStart(2, "0");
  return {
    from: `${year}-${mm}-01`,
    to: `${year}-${mm}-${String(lastDay).padStart(2, "0")}`,
  };
}

// The range asked for in the URL. A missing or invalid value falls back to
// the current month's; a range that ends before it starts falls back entirely.
export function resolveDayRange(
  from: unknown,
  to: unknown,
): DayRange & { isDefault: boolean } {
  const month = currentMonthRange();
  const range = {
    from: isDayString(from) ? from : month.from,
    to: isDayString(to) ? to : month.to,
  };

  if (range.from > range.to) return { ...month, isDefault: true };

  return {
    ...range,
    isDefault: range.from === month.from && range.to === month.to,
  };
}
