# Feedback Module

`src/feedback`: post-experience ratings/comments, plus a cron-driven queue that reminds attendees to leave feedback once an experience ends.

## Structure

```
feedback/
├── feedback.module.ts
├── feedback.constants.ts         # FEEDBACK_REMINDER_CRON_EXPRESSION, see note below
├── feedback.controller.ts        # @Controller('feedback')
├── feedback.service.ts
├── pending-feedback.service.ts
├── entities/
│   ├── feedback.entity.ts
│   └── pending-feedback.entity.ts
├── jobs/
│   └── feedback.cron.ts          # @Cron: finds ended experiences, enqueues reminders
└── queues/
    ├── feedback-queue.module.ts       # registers Bull queue 'feedback-request'
    └── feedback-request.processor.ts  # @Processor('feedback-request'): creates PendingFeedback rows
```

## Entity notes

- `Feedback`: `comment`, `rating`, `userId`/`experienceId` FKs, `experienceTitle` (denormalized for fast display without a join).
- `PendingFeedback` (`pending_feedback` table): composite `userId`+`experienceId` primary key, `experienceTitle`.

## Automated reminders

`feedback.cron.ts` runs on a schedule (`@nestjs/schedule`), finds experiences whose `sessionEndTime` has passed with confirmed bookings, and adds one `feedback-request` Bull job per attendee. The processor then creates a `PendingFeedback` row so the client can surface a "rate your experience" prompt. The schedule itself is `FEEDBACK_REMINDER_CRON_EXPRESSION` in `feedback.constants.ts` (`'0 */19999 * * * *'`), which does not mean "every 5 minutes" despite the value's origin: the minute field is out of Cron's valid 0-59 range and collapses to matching only minute 0, so this currently fires once per hour on the hour. Left unchanged pending a deliberate decision on the intended interval, see [root README > Known Gaps](../../README.md#known-gaps--next-planned-work).

## Endpoints

`@Controller('feedback')`, `JwtCookieGuard` applied per-route

| Method | Route | Description |
|---|---|---|
| POST | `/v1/feedback/:experienceId` | Submit feedback (rating + comment) for an experience |
| GET | `/v1/feedback/experience/:experienceId` | List all feedback for an experience |
| GET | `/v1/feedback/pending` | List pending feedback prompts for the current user |
| DELETE | `/v1/feedback/pending/:id` | Dismiss a pending feedback item |
