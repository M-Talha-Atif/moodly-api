// How long before an experience's session start a QR code becomes scannable for check-in.
export const CHECK_IN_EARLY_WINDOW_MS = 60 * 60 * 1000;

// Scoped rate limit for POST /attendance/check-in specifically (see AttendanceModule):
// the app-wide ThrottlerModule is disabled, but this endpoint is unauthenticated by design
// (the signed QR/join-code token is the credential), so it needs its own limit regardless.
export const CHECK_IN_THROTTLE_LIMIT = 10;
export const CHECK_IN_THROTTLE_TTL_MS = 60 * 1000;
