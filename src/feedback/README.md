# Feedback Module

`src/feedback` — post-experience ratings/comments, plus a cron-driven queue that reminds attendees to leave feedback once an experience ends.

## Structure

```
feedback/
├── feedback.module.ts
├── feedback.controller.ts        # @Controller('feedback')
├── feedback.service.ts
├── pending-feedback.service.ts
├── entities/
│   ├── feedback.entity.ts
│   └── pending-feedback.entity.ts
├── jobs/
│   └── feedback.cron.ts          # @Cron — finds ended experiences, enqueues reminders
└── queues/
    ├── feedback-queue.module.ts       # registers Bull queue 'feedback-request'
    └── feedback-request.processor.ts  # @Processor('feedback-request') — creates PendingFeedback rows
```

## Entity notes

- `Feedback`: `comment`, `rating`, `userId`/`experienceId` FKs, `experienceTitle` (denormalized for fast display without a join).
- `PendingFeedback` (`pending_feedback` table): composite `userId`+`experienceId` primary key, `experienceTitle`.

## Automated reminders

`feedback.cron.ts` runs on a schedule (`@nestjs/schedule`), finds experiences whose `sessionEndTime` has passed with confirmed bookings, and adds one `feedback-request` Bull job per attendee. The processor then creates a `PendingFeedback` row so the client can surface a "rate your experience" prompt. See [root README > Background Jobs](../../README.md#background-jobs-bullmq--bull) — the cron expression currently in the code (`0 */19999 * * * *`) doesn't match its "every 5 minutes" comment and is worth verifying before relying on it in production.

## Endpoints

`@Controller('feedback')`, `JwtCookieGuard` applied per-route

| Method | Route | Description |
|---|---|---|
| POST | `/feedback/:experienceId` | Submit feedback (rating + comment) for an experience |
| GET | `/feedback/experience/:experienceId` | List all feedback for an experience |
| GET | `/feedback/pending` | List pending feedback prompts for the current user |
| DELETE | `/feedback/pending/:id` | Dismiss a pending feedback item |
