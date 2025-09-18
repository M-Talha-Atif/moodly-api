// src/common/utils/context-time.ts

/**
 * Returns time of day category based on given Date.
 * Categories: morning, afternoon, evening, night
 */
export function getTimeOfDay(date: Date): string {
  const hour = date.getHours();

  if (hour >= 5 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 17) {
    return 'afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'evening';
  } else {
    return 'night';
  }
}

/**
 * Returns day of week name (e.g., Monday, Tuesday).
 */
export function getDayOfWeek(date: Date): string {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  return days[date.getDay()];
}
