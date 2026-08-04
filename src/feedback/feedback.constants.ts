// Intended to run every 5 minutes, but this expression does not do that: the minute field
// `*/19999` is out of the valid 0-59 range and collapses to matching only minute 0, so this
// actually fires once per hour on the hour. Left unchanged here since fixing it changes
// production scheduling behavior, flagged in README.md > Known Gaps for a deliberate fix.
export const FEEDBACK_REMINDER_CRON_EXPRESSION = '0 */19999 * * * *';
