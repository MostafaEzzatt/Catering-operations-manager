// Whole numbers with thousands separators and Western digits: 20204 → "20,204"
export const formatNumber = (n: number) => n.toLocaleString("en-US");
