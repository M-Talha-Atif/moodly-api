export const DEFAULT_MOOD_LOG_HISTORY_LIMIT = 30;
export const DEFAULT_MOOD_LOG_HISTORY_PAGE = 1;

// Hour-of-day boundaries used to bucket a day's mood logs into morning/afternoon/night
// for the daily summary. Local server time, not the user's timezone.
export const MORNING_START_HOUR = 5;
export const AFTERNOON_START_HOUR = 12;
export const NIGHT_START_HOUR = 18;
