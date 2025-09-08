// time-filters.ts
import {
  startOfDay,
  endOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addWeeks,
  addMonths,
  nextSaturday,
  nextSunday,
} from 'date-fns';

export type TimeRange = { start: Date; end: Date };

export const timeFilterMap: Record<string, (now: Date) => TimeRange | null> = {
  today: (now) => ({
    start: startOfDay(now),
    end: endOfDay(now),
  }),
  tomorrow: (now) => ({
    start: startOfDay(addDays(now, 1)),
    end: endOfDay(addDays(now, 1)),
  }),
  weekend: (now) => ({
    start: startOfDay(nextSaturday(now)),
    end: endOfDay(nextSunday(now)),
  }),
  this_week: (now) => ({
    start: startOfWeek(now, { weekStartsOn: 1 }),
    end: endOfWeek(now, { weekStartsOn: 1 }),
  }),
  next_week: (now) => ({
    start: startOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
    end: endOfWeek(addWeeks(now, 1), { weekStartsOn: 1 }),
  }),
  this_month: (now) => ({
    start: startOfMonth(now),
    end: endOfMonth(now),
  }),
  next_month: (now) => ({
    start: startOfMonth(addMonths(now, 1)),
    end: endOfMonth(addMonths(now, 1)),
  }),
  upcoming: (now) => ({
    start: startOfDay(now),
    end: endOfMonth(addMonths(now, 12)), // e.g., 1 year horizon
  }),
  past: (now) => ({
    start: new Date(2000, 0, 1), // arbitrary "very old" start
    end: endOfDay(addDays(now, -1)),
  }),
};
