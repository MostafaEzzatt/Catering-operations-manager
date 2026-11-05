// Lets a search match regardless of common Arabic spelling variants
// (أ/إ/آ → ا, ى → ي, ة → ه), diacritics and tatweel, and Latin letter case
export const normalizeArabic = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");

// Companies whose name or code contains the search, in their given order
export function searchCompanies<T extends { name: string; code: string }>(
  companies: T[],
  search: string,
): T[] {
  const term = normalizeArabic(search.trim());
  if (!term) return companies;
  return companies.filter(
    (c) =>
      normalizeArabic(c.name).includes(term) ||
      normalizeArabic(c.code).includes(term),
  );
}
