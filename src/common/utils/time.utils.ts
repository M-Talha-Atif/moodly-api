export function formatTime(
  value?: Date | string | null,
  options?: { hour12?: boolean; includeSeconds?: boolean },
): string | null {
  if (!value) return null;

  const dateObj = value instanceof Date ? value : new Date(value);

  if (isNaN(dateObj.getTime())) return null; // invalid date

  const hour12 = options?.hour12 ?? true; // Default to 12-hour format with AM/PM
  const includeSeconds = options?.includeSeconds ?? false;

  // Format to HH:MM or HH:MM:SS in 12-hour with AM/PM, or 24-hour
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: hour12 ? 'numeric' : '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12,
  });

  return formatter.format(dateObj);
}
