# Onboarding Module

`src/onboarding` — multi-step onboarding flow (questions → goals → activities → complete), stored in MongoDB rather than Postgres since the shape evolves per step and doesn't need relational joins. Two parallel flows exist: one for regular users, one for hosts.

## Structure

```
onboarding/
├── onboarding.module.ts
├── onboarding.controller.ts      # @Controller('onboarding') — user flow
├── onboarding.service.ts
├── controller/
│   └── host-onboarding.controller.ts   # @Controller('host/onboarding')
├── service/
│   └── host-onboarding.service.ts
├── schemas/
│   ├── user-onboarding.schema.ts   # Mongoose schema
│   └── host-onboarding.schema.ts
└── dto/
```

Both schemas track: `userId`, `responses[]`, `goals[]`, `activities[]`, `currentStep`, `completed`.

## Completion event

When a user finishes onboarding, an `onboarding.completed` RabbitMQ event is emitted; `OnboardingWorker` (`src/worker/onboarding.worker.ts`) consumes it and flips `user.onboardingCompleted = true` on the Postgres `User` row — keeping the Mongo onboarding-progress document and the Postgres flag consistent without a direct cross-database transaction. See [root README > Event-Driven Architecture](../../README.md#event-driven-architecture-rabbitmq).

## Endpoints

### User onboarding — `@Controller('onboarding')`, `JwtCookieGuard`

| Method | Route | Description |
|---|---|---|
| POST | `/onboarding/start` | Start (or resume) the onboarding flow |
| POST | `/onboarding/answer` | Submit an answer to the current question |
| POST | `/onboarding/goals` | Set selected goals |
| POST | `/onboarding/activities` | Set selected activities |
| POST | `/onboarding/complete` | Mark onboarding complete → emits `onboarding.completed` |
| GET | `/onboarding/status` | Get current step / completion status |

### Host onboarding — `@Controller('host/onboarding')`, `JwtCookieGuard`

Identical shape, host-scoped: `POST /host/onboarding/start`, `/answer`, `/goals`, `/activities`, `/complete`, and `GET /host/onboarding/status`.
