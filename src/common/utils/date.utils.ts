// src/utils/date.util.ts
export function formatDate(value?: Date | string | null): string | null {
  if (!value) return null;

  const dateObj = value instanceof Date ? value : new Date(value);

  if (isNaN(dateObj.getTime())) return null; // invalid date

  // 👇 convert to YYYY-MM-DD only
  return dateObj.toISOString().split('T')[0];
}
