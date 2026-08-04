// Exponential-ish backoff for reconnect attempts: delay = min(attempt * base, cap).
export const REDIS_RETRY_BASE_DELAY_MS = 50;
export const REDIS_RETRY_MAX_DELAY_MS = 2000;

export const REDIS_MAX_RETRIES_PER_REQUEST = 3;
