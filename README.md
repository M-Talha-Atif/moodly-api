# Moodly Backend — AI Moodler

Wellness and social-experience platform powered by **two independent backend services**:

1. **This repository** — a NestJS application (API server + a separate worker process) that owns business logic: auth, users, bookings, experiences, community, notifications, recommendations.
2. **A separate FastAPI inference service** (different repo, documented here for context only) — runs the actual AI models (voice/image emotion detection, text embeddings).

The two talk to each other over HTTP (NestJS calls FastAPI synchronously to run inference) and RabbitMQ (results and downstream side effects flow asynchronously back into NestJS).

> Looking for a specific module's API reference? Every folder under [`src/`](src) that exposes routes has its own `README.md` — see the [module index](#module-index) below.

---

## Table of Contents

- [Why Two Backend Services?](#why-two-backend-services)
- [High-Level Architecture](#high-level-architecture)
- [Project Structure](#project-structure)
- [Module Index](#module-index)
- [Backend Base Structure (how a module is wired)](#backend-base-structure-how-a-module-is-wired)
- [Features](#features)
- [Engineering Challenges Handled](#engineering-challenges-handled)
- [Event-Driven Architecture (RabbitMQ)](#event-driven-architecture-rabbitmq)
- [Background Jobs (BullMQ / Bull)](#background-jobs-bullmq--bull)
- [Sample Request Flow — Creating a Booking](#sample-request-flow--creating-a-booking)
- [Sample Event Flow — Mood Log to Recommendation](#sample-event-flow--mood-log-to-recommendation)
- [Database](#database)
- [Scale: Current Capacity & Where Overflow Goes](#scale-current-capacity--where-overflow-goes)
- [Auth](#auth)
- [FastAPI Inference Service (external repo)](#fastapi-inference-service-external-repo)
- [Environment Variables](#environment-variables)
- [Project Setup](#project-setup)
- [Known Gaps / Next Planned Work](#known-gaps--next-planned-work)

---

## Why Two Backend Services?

The system is split so that **AI inference** (resource-heavy, GPU-optional) scales independently from **business logic** (booking, auth, user management). Voice emotion classification via HuBERT, facial emotion detection via DeepFace, and text embedding generation via SentenceTransformer run in the FastAPI service without blocking API response times in the NestJS service.

Within *this* repository, there's a second split for the same reason: the **API process** (`src/main.ts`, port `3002`) handles HTTP requests and must stay responsive, while the **worker process** (`src/worker/main.ts`, port `3001`) consumes RabbitMQ events and does slower, retryable background work (calling the FastAPI service, generating embeddings, running the recommendation engine). They share the same codebase and the same Postgres/Mongo connections but run as two separate OS processes (`npm run start` vs `npm run start:worker`), so a slow inference call never blocks an HTTP response.

---

## High-Level Architecture

```mermaid
flowchart TB
    Frontend["Client App"] -->|HTTP REST + cookies/JWT| API[NestJS API :3002]
    Frontend -->|Multipart upload photo/voice| API
    API -->|HTTP: analyze / embed| FastAPI[FastAPI Inference Service :8000]

    subgraph API["NestJS API process"]
        direction TB
        Auth["Auth · Users · Profile"]
        Onboarding["Onboarding"]
        Experience["Experience · Booking · Attendance"]
        Community["Community · Feedback · Notification"]
        Recommendation["Recommendation"]
    end

    subgraph Worker["NestJS Worker process :3001"]
        direction TB
        MoodW["Mood Detection Worker"]
        EmbedW["Embedding Worker"]
        RecW["Recommendation Worker"]
        OnbW["Onboarding Worker"]
        ExpW["Experience AI Worker"]
    end

    API -->|amqplib emit| RMQ[(RabbitMQ<br/>5 exchange/queue pairs)]
    RMQ -->|@EventPattern consume| Worker
    Worker -->|amqplib emit follow-up events| RMQ
    Worker -->|Socket.IO push| Frontend

    API --> PG[(PostgreSQL<br/>via TypeORM)]
    Worker --> PG
    API --> Mongo[(MongoDB<br/>via Mongoose<br/>onboarding + embeddings)]
    Worker --> Mongo
    API --> Redis[(Redis<br/>BullMQ + cache/lock primitives)]
    API -->|BullMQ jobs| Redis

    API --> S3[(AWS S3<br/>images/avatars)]
    API --> SMTP[Email via Nodemailer]
    FastAPI -.->|models loaded once at startup| Models[[HuBERT / DeepFace / MiniLM]]
```

---

## Project Structure

```text
ai-moodler-backend/
├── src/
│   ├── main.ts                    # API process bootstrap (port 3002)
│   ├── app.module.ts              # composition root — imports every feature module
│   ├── app.controller.ts / app.service.ts
│   │
│   ├── auth/                      # JWT (access+refresh) + Google OAuth
│   │   ├── auth.controller.ts, auth.service.ts, auth.module.ts
│   │   ├── dto/  guards/  strategies/
│   │
│   ├── users/                     # user CRUD + profile sub-module
│   │   ├── users.controller.ts, users.service.ts, entities/ mapper/ dto/
│   │   └── profile/                # self-service profile (avatar, password)
│   │
│   ├── onboarding/                 # multi-step onboarding, Mongo-backed
│   │   ├── onboarding.controller.ts / .service.ts (user)
│   │   └── controller/, service/    (host-scoped variant)
│   │
│   ├── experience/                 # bookable "experience" domain
│   │   ├── controllers/            (host / public / user split controllers)
│   │   ├── services/host/          (CRUD, AI generation via Gemini)
│   │   ├── services/                (filters, recommendation matching)
│   │   ├── experience.gateway.ts   # Socket.IO live-spots
│   │   └── entities/
│   │
│   ├── booking/                    # booking lifecycle
│   │   ├── controller/             (host-booking, user-booking)
│   │   ├── services/user/          (creation, cancellation, validation,
│   │   │                            filter, mapper, query, side-effects)
│   │   ├── services/host/          (query, stats)
│   │   └── entities/
│   │
│   ├── attendance/                 # QR / join-code check-in, 1:1 with booking
│   ├── mood-log/                   # mood logging (text/photo/voice)
│   │   ├── services/                (mood-log, emotion-analysis, storage, validation)
│   │   └── entities/ dto/ interfaces/
│   │
│   ├── embedding/                  # text embedding generation + Mongo storage
│   │   ├── schemas/                (experience, moodlog, community, post — vectors)
│   │   └── services/
│   │
│   ├── recommendation/             # emotion + embedding based matching, LLM rerank
│   │   ├── providers/               (openai-ranking, gemini-ranking)
│   │   ├── services/                (recommendation, llm-ranking)
│   │   └── recommendation.gateway.ts
│   │
│   ├── feedback/                   # post-experience ratings
│   │   ├── jobs/                    (cron: enqueue pending feedback)
│   │   └── queues/                  (Bull processor)
│   │
│   ├── notification/               # in-app + email notifications
│   │   ├── jobs/                    (Bull processor: send email)
│   │   └── notification.gateway.ts (Socket.IO push)
│   │
│   ├── community/                  # groups, posts, reactions, comments
│   │   ├── services/community/ services/posts/ services/comments/
│   │   ├── entities/community/ entities/posts/
│   │   └── mapper/
│   │
│   ├── insights/                   # aggregated user analytics
│   ├── diagram/                    # GET /diagram — live Mermaid module graph
│   │
│   ├── common/                     # cross-cutting: S3, Gemini, ApiClient (FastAPI
│   │   │                            client), roles guard/decorator, ResultDto
│   │   └── services/ dto/ enums/ interceptors/ constants/
│   │
│   ├── redis/                      # ioredis wrapper: get/set/del + Lua-script lock
│   ├── rmq/                        # RabbitMQ ClientsModule dynamic factory
│   ├── config/                     # rmq.constants.ts — per-domain exchange/queue map
│   ├── bull-board/                 # Bull Board admin UI (mounted at /admin/queues)
│   ├── logger/                     # Winston config, AsyncLocalStorage request-id
│   ├── database/                   # TypeORM + Mongoose module, migrations, data-source
│   │
│   └── worker/                     # SEPARATE process entrypoint (main.ts, port 3001)
│       ├── mood-detection.worker.ts
│       ├── embedding.worker.ts
│       ├── recommendation.worker.ts
│       ├── onboarding.worker.ts
│       └── experience.worker.ts
│
├── certs/rds-ca.pem                # RDS Postgres SSL cert (prod only)
├── test/jest-e2e.json              # e2e harness config (no specs committed yet)
├── init.sql                        # manual schema reference (pgcrypto + vector ext)
├── nest-cli.json, tsconfig*.json, eslint.config*.mjs
└── package.json
```

---

## Module Index

Every module below has its own `README.md` in its folder with the full endpoint reference (method, route, guards, request/response shape). This root document covers cross-cutting architecture only.

| Module | Path | README |
|---|---|---|
| Auth | `src/auth` | [src/auth/README.md](src/auth/README.md) |
| Users | `src/users` | [src/users/README.md](src/users/README.md) |
| Profile | `src/users/profile` | [src/users/profile/README.md](src/users/profile/README.md) |
| Onboarding | `src/onboarding` | [src/onboarding/README.md](src/onboarding/README.md) |
| Experience | `src/experience` | [src/experience/README.md](src/experience/README.md) |
| Booking | `src/booking` | [src/booking/README.md](src/booking/README.md) |
| Attendance | `src/attendance` | [src/attendance/README.md](src/attendance/README.md) |
| Mood Log | `src/mood-log` | [src/mood-log/README.md](src/mood-log/README.md) |
| Embedding | `src/embedding` | [src/embedding/README.md](src/embedding/README.md) |
| Recommendation | `src/recommendation` | [src/recommendation/README.md](src/recommendation/README.md) |
| Feedback | `src/feedback` | [src/feedback/README.md](src/feedback/README.md) |
| Notification | `src/notification` | [src/notification/README.md](src/notification/README.md) |
| Community | `src/community` | [src/community/README.md](src/community/README.md) |
| Insights | `src/insights` | [src/insights/README.md](src/insights/README.md) |
| Diagram | `src/diagram` | [src/diagram/README.md](src/diagram/README.md) |
| Redis | `src/redis` | [src/redis/README.md](src/redis/README.md) |
| RabbitMQ client | `src/rmq` | [src/rmq/README.md](src/rmq/README.md) |
| Bull Board | `src/bull-board` | [src/bull-board/README.md](src/bull-board/README.md) |
| Common | `src/common` | [src/common/README.md](src/common/README.md) |
| Database | `src/database` | [src/database/README.md](src/database/README.md) |
| Worker process | `src/worker` | [src/worker/README.md](src/worker/README.md) |

---

## Backend Base Structure (how a module is wired)

Every feature module follows the same NestJS layering, e.g. `booking`:

```
Controller  (HTTP layer: guards, DTO validation, HTTP status mapping)
    ↓
Service (orchestrator, e.g. BookingService)
    ↓
Specialized services (single-responsibility: *-creation, *-validation,
    *-query, *-mapper, *-side-effects, *-error-handler, *-stats ...)
    ↓
TypeORM Repository / Mongoose Model  →  PostgreSQL / MongoDB
```

Conventions used across the codebase:

- **Guards stack**: most protected routes use `@UseGuards(JwtBearerGuard, JwtCookieGuard, RolesGuard)`. `JwtCookieGuard` alone already reads the `jwt` httpOnly cookie *or* falls back to an `Authorization: Bearer` header, so `JwtBearerGuard` is redundant on routes that also apply `JwtCookieGuard` — kept for explicitness in most controllers.
- **Response envelope**: almost every handler returns `ResultDto.ok(data, message, statusCode)` or throws an `HttpException` built from `ResultDto.fail(...)`, giving a consistent `{ success, statusCode, data, message }` / `{ success: false, statusCode, reason, errorType }` shape across the whole API (`src/common/dto/result.dto.ts`, `src/common/constants/error-code-map.ts`).
- **Validation**: global `ValidationPipe({ transform: true, whitelist: true })` (`src/main.ts`) — every DTO uses `class-validator` decorators.
- **Fire-and-forget side effects**: write-path services (e.g. `BookingCreationService`) commit the DB transaction first, then dispatch notifications/attendance creation as detached promises (`.catch()`-guarded, not awaited) so a slow email/QR job never delays the HTTP response.
- **Split controllers per audience**: several domains (`experience`, `booking`, `onboarding`) expose separate `host/*`, `user/*`, and `public/*` controllers instead of one controller with internal role branching, so route-level guards and Swagger tags stay unambiguous.

---

## Features

### Authentication & Users
| Feature | Description |
|---|---|
| Email/Password Auth | bcrypt-hashed (cost 12) signup and login with access/refresh token rotation |
| Google OAuth 2.0 | Passport-based social login, find-or-create by email |
| Role-based Access | `user`, `host`, `admin` roles enforced via `RolesGuard` + `@Roles()` |
| Privacy Settings | Per-user data sharing, community visibility, tracking consent |
| Cultural Profile | Ethnicity, religion, values, language preferences, communication style |
| Onboarding Flow | Multi-step MongoDB-backed onboarding (questions, goals, activities) — separate flows for users and hosts |

### Mood Logging & AI Emotion Detection
| Feature | Description |
|---|---|
| Multi-modal Logging | Text label, photo emotion (DeepFace), and voice sentiment (HuBERT), combined into `finalMood` |
| Async Analysis | Photo/voice analysis runs off the request path via RabbitMQ (`mood.detect` → worker) |
| Daily Summaries | Mood breakdown grouped into morning / afternoon / night |
| Streak & Heatmap | Consecutive-day streak calculation and date→mood heatmap data |
| File Storage | Uploaded media saved locally or to S3, downloaded back to a temp file when re-sent to FastAPI |

### Booking & Experiences
| Feature | Description |
|---|---|
| Race-safe Booking | Single CTE with `SELECT ... FOR UPDATE` inside a DB transaction atomically checks capacity and reserves a spot — see [Engineering Challenges](#engineering-challenges-handled) |
| Cancellation & Rebooking | Cancelling sets `status='cancelled'`; rebooking the same experience restores the row instead of inserting a duplicate |
| Host Dashboard | Revenue, average rating, 90-day trend, funnel, and emotional-outcome stats |
| QR Check-in | Signed token (`ATTENDANCE_JWT_SECRET`) turned into a QR code for in-person check-in |
| Real-time Spots | Socket.IO room per experience broadcasts `spotsLeft` after every booking/cancellation |
| AI Experience Generation | Host speaks/types a description; Gemini turns it into structured experience fields |

### Recommendations
| Feature | Description |
|---|---|
| Mood-driven Matching | Active path: `generateForUserByMood` matches experiences to the user's latest detected mood |
| Embedding Search | Secondary path: Mongo vector search + LLM rerank (OpenAI or Gemini, `RANKING_PROVIDER`) — implemented but not wired to a controller yet |
| Real-time Push | Recommendations delivered over Socket.IO the moment the worker finishes processing |

### Community
| Feature | Description |
|---|---|
| Group Management | Host-created communities, public search/filter, privacy settings |
| Membership Roles | member / moderator / admin per community |
| Posts, Reactions, Comments | Idempotent reaction upsert, cursor-paginated comments, author-only deletes |

### Feedback & Notifications
| Feature | Description |
|---|---|
| Post-Experience Feedback | Rating + comment, duplicate prevention |
| Automated Reminders | Cron job finds ended experiences and enqueues a Bull job per attendee (see note on the cron expression under [Known Gaps](#known-gaps--next-planned-work)) |
| In-app + Email + Push (partial) | Notification row + Socket.IO push always happen; email is queued through BullMQ; push is stubbed |

### System & Infrastructure
| Feature | Description |
|---|---|
| API Documentation | Swagger UI at `/api-docs` |
| Job Monitoring | Bull Board dashboard at `/admin/queues` |
| Live Module Graph | `GET /diagram` renders a Mermaid dependency graph of the running app via `nestjs-spelunker` |
| Structured Logging | Winston, daily-rotating file transport, per-request ID via `AsyncLocalStorage` |
| Input Validation | Global `ValidationPipe` + `class-validator` on every DTO |

---

## Engineering Challenges Handled

**1. Preventing double-booking under concurrency.**
Two users tapping "book" on the last spot of an experience at the same instant is a classic race condition. `BookingCreationService.tryCreateOrRestoreBooking` (`src/booking/services/user/booking-creation.service.ts`) handles it with a single raw-SQL statement, executed inside a `READ COMMITTED` transaction opened by `TransactionService` (`src/common/services/transaction.service.ts`):
```sql
WITH selected_experience AS (
  SELECT e.* FROM "experience" e WHERE e.id = $1 FOR UPDATE   -- row-locks the experience
), ...
insert_new AS (
  INSERT INTO "booking" (...)
  SELECT $1, $2, 'confirmed', now()
  FROM selected_experience se
  WHERE NOT EXISTS (...) AND se."spotsFilled" < se."totalSpots"   -- capacity check + insert, atomically
  RETURNING *
), update_spots AS ( UPDATE "experience" SET "spotsFilled" = "spotsFilled" + 1 ... )
```
The `FOR UPDATE` lock serializes concurrent bookings for the *same experience* at the database level, so the capacity check and the insert can never race — a second transaction blocks on the row lock until the first commits, then sees the updated `spotsFilled` and correctly fails with "No available spots". This is stronger than an application-level Redis lock because it can't drift out of sync with the actual row.

> Note: `RedisService` also exposes `acquireLock`/`releaseLock` (Lua-script-based `SET NX` + compare-and-delete), but it is not currently called anywhere in the codebase — booking concurrency is handled entirely at the Postgres layer today.

**2. Decoupling slow AI inference from the request/response cycle.**
Emotion analysis (HuBERT, DeepFace) and embedding generation take real time and call an external service. Rather than making `POST /mood-log` wait on that, the endpoint persists the raw log and returns `201` immediately, then emits a `mood.detect` event onto RabbitMQ. The separate worker process consumes it, calls FastAPI, writes the result back, and chains a follow-up event to regenerate recommendations — see [Sample Event Flow](#sample-event-flow--mood-log-to-recommendation).

**3. Two data stores for two shapes of data.** Relational, highly-related domain data (users, bookings, experiences, community) lives in PostgreSQL via TypeORM, where foreign keys and transactions matter. Loosely-structured, evolving documents (onboarding answers, embedding vectors) live in MongoDB via Mongoose, where schema flexibility matters more than joins.

**4. Keeping the HTTP response fast when a write has multiple side effects.** Booking creation triggers attendance-record creation *and* a notification *and* a Socket.IO broadcast. All three run after the DB transaction commits, as detached (non-awaited, `.catch()`-guarded) calls, so a slow email/notification path never adds latency to the booking response — at the cost of those side effects being best-effort rather than transactionally guaranteed.

**5. Duplicate work across a host/user/public split.** `experience` and `booking` (and `onboarding`) expose separate controllers per audience instead of one controller with role branching inside each handler — this keeps `@UseGuards`/`@Roles` declarative and unambiguous per route, at the cost of some duplication between `experience.controller.ts` (legacy combined controller, still registered) and the newer `controllers/experience.*.controller.ts` split. Worth consolidating — see [Known Gaps](#known-gaps--next-planned-work).

---

## Event-Driven Architecture (RabbitMQ)

The API process and the worker process are two separate Nest applications connected only by RabbitMQ — no direct function calls cross the process boundary.

**Domain registry** (`src/config/rmq.constants.ts`) defines one exchange + one durable queue per domain:

| Domain | Exchange | Queue | Routing keys |
|---|---|---|---|
| Mood | `mood-exchange` | `mood-tasks` | `mood.detect`, `mood.analyzed` |
| Community | `community-exchange` | `community-tasks` | `community.embedding.generate` |
| Recommendation | `recommendation-exchange` | `recommendation-tasks` | `recommendation.generate` |
| Onboarding | `onboarding-exchange` | `onboarding-tasks` | `onboarding.completed` |
| Experience | `experience-exchange` | `experience-tasks` | `experience.generate_ai` |

**Producers** (`ClientProxy.emit(...)`, fire-and-forget, no reply expected) — API-side services inject the relevant client (e.g. `@Inject(RMQ_DOMAINS.MOOD.CLIENT)`) via `RmqModule.register(...)` (`src/rmq/rmq.module.ts`).

**Consumers** — `src/worker/main.ts` boots a single Nest application (`WorkerModule`) that opens **five separate RabbitMQ connections**, one per domain, each with `prefetchCount: 1` (process one message at a time per domain before acking the next):

- `mood-detection.worker.ts` — `@EventPattern('mood.detect')`: calls FastAPI for photo/voice analysis, writes `finalMood` back to the `MoodLog` row, then emits `recommendation.generate`.
- `embedding.worker.ts` — `@EventPattern('mood.analyzed')` / `community.embedding.generate`: generates and stores vector embeddings in Mongo.
- `recommendation.worker.ts` — `@EventPattern('recommendation.generate')`: runs the recommendation engine and pushes results over Socket.IO.
- `onboarding.worker.ts` — `@EventPattern('onboarding.completed')`: flips `user.onboardingCompleted`.
- `experience.worker.ts` — `@EventPattern('experience.generate_ai')`: runs Gemini experience-field generation and saves it onto the `Experience` row.

Run the worker as its own process: `npm run start:worker` (separate from `npm run start`, which only runs the API).

---

## Background Jobs (BullMQ / Bull)

Two message-passing systems coexist for two different jobs: RabbitMQ moves events **between the API and worker processes**; BullMQ/Bull moves **delayed and retryable jobs within the API process itself**, backed by Redis.

> Two different queue libraries are in use side by side: `main.ts` instantiates queues directly with the modern `bullmq` package (for Bull Board), while the actual job processors are registered through `@nestjs/bull` (a wrapper around the older `bull` package). Functionally compatible since both point at the same Redis queues, but worth knowing if you're adding a new queue — follow the `@nestjs/bull` pattern used by the existing processors below.

| Queue | Registered in | Producer | Processor | Purpose |
|---|---|---|---|---|
| `notification-queue` | `src/notification/notification.module.ts` | `NotificationService.createAndSend()` | `src/notification/jobs/notification.processor.ts` | Sends email via Nodemailer (`type: 'email'`); `type: 'push'` is stubbed, not implemented |
| `feedback-request` | `src/feedback/queues/feedback-queue.module.ts` | `src/feedback/jobs/feedback.cron.ts` (`@Cron`, `@nestjs/schedule`) | `src/feedback/queues/feedback-request.processor.ts` | Creates a `PendingFeedback` row per attendee once an experience's session has ended |
| `mood-queue` | `src/bull-board/bull-board.module.ts` | registered for Bull Board visibility | — | Currently monitoring-only; mood processing itself runs through RabbitMQ, not this queue |

All three queues are also visible (jobs, retries, failures) in **Bull Board** at `GET /admin/queues` — see [src/bull-board/README.md](src/bull-board/README.md).

---

## Sample Request Flow — Creating a Booking

`POST /user/bookings` end-to-end, tracing real files:

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Guards (JwtBearerGuard → JwtCookieGuard → RolesGuard)
    participant VP as Global ValidationPipe
    participant Ctrl as UserBookingController
    participant Svc as BookingService
    participant Create as BookingCreationService
    participant Tx as TransactionService
    participant PG as PostgreSQL
    participant Side as BookingSideEffectsService
    participant WS as ExperienceGateway (Socket.IO)

    C->>G: POST /user/bookings {experienceId} + jwt cookie
    G->>G: verify JWT, attach req.user, check role
    G->>VP: forward request
    VP->>VP: validate CreateBookingDto (class-validator)
    VP->>Ctrl: create(dto, req)
    Ctrl->>Svc: createBooking(userId, dto)
    Svc->>Create: createBooking(userId, dto)
    Create->>Tx: withTransaction(fn)
    Tx->>PG: BEGIN (READ COMMITTED)
    Tx->>PG: CTE — SELECT experience FOR UPDATE, check existing booking,\ninsert-or-restore, increment spotsFilled (one round trip)
    PG-->>Tx: booking row (or 0 rows → diagnostic query → 404/409/400)
    Tx->>PG: COMMIT
    Tx-->>Create: saved booking (with relations)
    Create->>Side: queueBookingCreatedSideEffects(booking) [not awaited]
    Side-->>C: (async) attendance row created, notification saved +\nemail queued to BullMQ + Socket.IO push to user
    Create->>WS: emitSpotsUpdate(experienceId, spotsLeft)
    WS-->>C: (async, to anyone viewing this experience) spots-update event
    Create-->>Svc: ResultDto.ok(bookingDto)
    Svc-->>Ctrl: ResultDto.ok(bookingDto)
    Ctrl-->>C: 201 { success: true, data: {...} }
```

Key points this illustrates:
- The guard chain runs before the DTO is even parsed by `ValidationPipe`, so unauthenticated requests never reach validation or the service layer.
- The entire capacity-check-and-reserve step is one database round trip inside one transaction (see [Engineering Challenges](#engineering-challenges-handled)) — there is no read-then-write gap for a race to exploit.
- Everything after the transaction commits (attendance, notification, email, Socket.IO) is fire-and-forget: the client gets its `201` as soon as the booking row exists, not after every side effect completes.

---

## Sample Event Flow — Mood Log to Recommendation

`POST /mood-log` with a voice/photo upload, through both processes:

```mermaid
sequenceDiagram
    participant C as Client
    participant API as NestJS API (MoodLogService)
    participant PG as PostgreSQL
    participant RMQ as RabbitMQ
    participant W1 as Worker: MoodDetectionWorker
    participant FA as FastAPI Inference Service
    participant W2 as Worker: RecommendationWorker
    participant WS as RecommendationGateway (Socket.IO)

    C->>API: POST /mood-log (multipart: photo/voice + moodLabel)
    API->>PG: INSERT MoodLog (finalMood = moodLabel for now)
    API-->>C: 201 "Mood log created; analysis queued"
    API->>RMQ: emit mood.detect {moodLogId, userId, photoPath, voicePath}

    RMQ->>W1: consume mood.detect (prefetch=1)
    W1->>FA: POST /analyze-image-emotion (if photo)
    W1->>FA: POST /analyze-voice-emotion (if voice)
    FA-->>W1: dominant_emotion per modality
    W1->>PG: UPDATE MoodLog SET finalMood, photoEmotion, voiceSentiment
    W1->>RMQ: emit recommendation.generate {userId, userMood: finalMood}

    RMQ->>W2: consume recommendation.generate (prefetch=1)
    W2->>PG: match experiences by target emotion (generateForUserByMood)
    W2->>WS: sendRecommendations(userId, list)
    WS-->>C: Socket.IO push (room keyed by ?userId= on connect)
```

The client that uploaded the mood log gets an immediate `201`, then — seconds later, asynchronously — a Socket.IO push with recommendations once both hops through RabbitMQ complete. No HTTP polling is needed on the client side.

---

## Database

Two databases, both configured in `src/database/database.module.ts`, shared by the API process and the worker process (each process opens its **own** connection pool to each):

| Store | Driver | Used for |
|---|---|---|
| PostgreSQL | TypeORM (`pg`) | Users, experiences, bookings, attendance, feedback, notifications, community — anything relational |
| MongoDB | Mongoose | Onboarding documents, vector embeddings (experience/moodlog/community/post) |

- `synchronize: NODE_ENV !== 'production'` — schema auto-syncs from entities outside production; production relies on TypeORM migrations under `src/database/migrations/` (run via `npm run migration:run:prod`).
- Production Postgres connections use SSL with the bundled RDS CA cert (`certs/rds-ca.pem`).
- **No explicit pool size is configured anywhere** (`extra.max`, `poolSize`, etc. are all absent) — both drivers run on their library defaults. See [Scale](#scale-current-capacity--where-overflow-goes) for what that means in practice.

---

## Scale: Current Capacity & Where Overflow Goes

This section describes the **capacity implied by what's actually configured in this repo today** — not a load-tested SLA. There is no `extra.max`, `poolSize`, PgBouncer, Node cluster mode, PM2 config, or Docker/K8s replica setup anywhere in the repository, so the numbers below describe a **single API instance + single worker instance**, each talking directly to Postgres/Mongo/Redis.

| Resource | Default in effect | Source |
|---|---|---|
| Postgres pool (API process) | `max: 10` connections (node-postgres / `pg` default — TypeORM doesn't override it) | `src/database/database.module.ts` |
| Postgres pool (worker process) | `max: 10` connections, **separate pool** from the API's | `src/worker/worker.module.ts` (imports the same `DatabaseModule`, but as its own process it gets its own pool) |
| Mongoose pool (per process) | `maxPoolSize: 100` (Mongoose default) | `src/database/database.module.ts` |
| Redis | 1 TCP connection via `ioredis`, no connection pooling (Redis is single-threaded per connection anyway; BullMQ opens its own separate connections per queue) | `src/redis/redis.service.ts`, `src/main.ts` |
| RabbitMQ worker concurrency | `prefetchCount: 1` × 5 domain connections = **at most 5 events processed in parallel**, one per domain, across the whole worker process | `src/worker/main.ts` |
| HTTP concurrency (API) | Bounded by Node's single-threaded event loop per process — no cluster/PM2 config present, so one process = one CPU core doing request handling | `src/main.ts` |

**What this means concretely:**

- **Concurrent HTTP connections**: Node/Express can accept and hold open many hundreds of concurrent sockets fine (I/O is non-blocking), but any handler that touches Postgres is capped at **10 simultaneous in-flight queries** per API instance. The 11th concurrent DB-bound request doesn't fail — it queues inside node-postgres's internal pool wait queue until a connection frees up, and only fails if the caller-side timeout (client/proxy) is hit first, since no explicit `connectionTimeoutMillis` is set on the pool.
- **"How many users" / "how many concurrent users"**: there's no hard cap enforced by the app (rate limiting is installed but disabled — see below), so this is really "how many concurrent *DB-bound* requests can be serviced without queuing," which today is **~10 per API instance**. Read-heavy, non-DB-bound traffic (e.g. static Swagger docs) isn't affected by this ceiling. Realistic total concurrent users the system can serve *without visibly increasing latency* depends on how many requests per user are in flight at once, but with a 10-connection pool and typical query times in the tens of milliseconds, sustained throughput is on the order of a few hundred DB-touching requests per second on default hardware before the pool becomes the bottleneck — well below what the underlying Postgres instance itself could otherwise support.
- **Where overflow goes**: it doesn't get rejected — it queues, at two levels: (1) inside the node-postgres pool's wait queue once >10 queries are in flight, and (2) inside RabbitMQ's durable queues once event throughput exceeds what `prefetchCount: 1` per domain can drain (messages simply sit in the queue — durable, so they survive a worker restart — until a worker connection is free to consume the next one). Neither layer drops work; both simply add latency under load. There is currently no dead-letter queue, no queue-depth alerting, and no backpressure signal sent back to the API when the worker falls behind.
- **Max simultaneous DB connections across the whole system**: with one API instance + one worker instance, that's `10 (API) + 10 (worker) = 20` Postgres connections at steady state, plus a handful more from ad-hoc `typeorm` CLI usage (migrations). A typical small managed Postgres tier (e.g. AWS RDS `db.t3.micro`) caps `max_connections` around 65–100, so this repo's defaults leave headroom for roughly **3–4 more full API+worker replica pairs** before hitting that ceiling — but nothing here coordinates that; adding replicas today would require either raising `max_connections`, adding an explicit `extra.max` per instance, or introducing a pooler (PgBouncer / RDS Proxy) so pool sizes don't need to shrink as replicas grow.
- **Rate limiting is not currently active.** `@nestjs/throttler` is installed and pre-configured (`default`: 120 req/min, `auth`: 15 req/min, `login`: 5 req/min) but the whole `ThrottlerModule.forRoot([...])` block and its `APP_GUARD` provider are commented out in `src/app.module.ts`. Several controllers still carry `@SkipThrottle()`, which is currently a no-op since no `ThrottlerGuard` is registered anywhere. Until this is re-enabled, nothing in the app itself protects against a single client opening far more concurrent requests than the pool can serve.

**To raise these ceilings**, in order of effort: (1) set `extra: { max: N }` on the TypeORM config and re-tune per available `max_connections`; (2) re-enable `ThrottlerModule` in `app.module.ts`; (3) run the API behind a load balancer with multiple replicas + a connection pooler in front of Postgres; (4) raise `prefetchCount` on the worker's RMQ connections (trades ordering/backpressure safety for throughput); (5) move Redis to a clustered/managed tier if BullMQ throughput becomes the bottleneck.

---

## Auth

- **JWT** access + refresh tokens (`@nestjs/jwt`), both currently signed with a **7-day** expiry (`src/auth/auth.service.ts`) — the refresh token hash is stored (bcrypt) on the `User` row and rotated on every `/auth/refresh` call.
- The `jwt` httpOnly cookie itself is set with `maxAge: 24h` (`src/auth/auth.controller.ts`), which is shorter than the JWT's own 7-day expiry — the cookie expires and forces a re-login well before the token would.
- **Google OAuth 2.0** via Passport (`src/auth/strategies/google.strategy.ts`) — find-or-create by email, then issues the same JWT pair.
- **Guards**: `JwtCookieGuard` (cookie, falls back to `Authorization: Bearer`), `JwtBearerGuard` (bearer-only), `RolesGuard` + `@Roles()` (`src/common/roles.guard.ts`). Most protected routes stack all three, though `JwtBearerGuard` is redundant wherever `JwtCookieGuard` is also present.
- **Attendance** uses a separate signed token (`ATTENDANCE_JWT_SECRET`/`ATTENDANCE_JWT_EXPIRATION`) for QR check-in, independent of the login JWT.
- Full endpoint reference: [src/auth/README.md](src/auth/README.md).

---

## FastAPI Inference Service (external repo)

This NestJS backend calls out to a separate Python FastAPI service (not part of this repository) via `ApiClientService` (`src/common/services/api-client.service.ts`, base URL `FASTAPI_URL`, bearer-token'd with `HF_TOKEN`). It exposes three endpoints:

| Endpoint | Model | Purpose |
|---|---|---|
| `POST /analyze-voice-emotion` | HuBERT (`superb/hubert-large-superb-er`) | WAV upload → dominant emotion + per-class confidence |
| `POST /analyze-image-emotion` | DeepFace | Image upload → dominant facial emotion |
| `POST /embed` | SentenceTransformer (`all-MiniLM-L6-v2`) | Text → 384-dimensional embedding vector |

All three models load once at FastAPI startup, not per request, to keep inference latency predictable. See `src/mood-log/services/emotion-analysis.service.ts` and `src/embedding/services/embedding.service.ts` for the calling code on this side.

---

## Environment Variables

See [`.env.example`](.env.example) for the full list of keys this repo reads (no real values are committed — `.env` is gitignored). Grouped summary:

| Group | Keys |
|---|---|
| Postgres | `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` |
| Mongo | `MONGO_URI`, `MONGO_DB` |
| Redis | `REDIS_URL` |
| App | `NODE_ENV`, `PORT`, `FRONTEND_URL` |
| Auth | `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ATTENDANCE_JWT_SECRET`, `ATTENDANCE_JWT_EXPIRATION`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` |
| RabbitMQ | `RABBITMQ_URL`, `RMQ_MOOD_QUEUE`/`RMQ_MOOD_EXCHANGE`, `RMQ_COMM_QUEUE`/`RMQ_COMM_EXCHANGE`, `RMQ_REC_QUEUE`/`RMQ_REC_EXCHANGE`, `RMQ_ONBOARDING_QUEUE`/`RMQ_ONBOARDING_EXCHANGE`, `RMQ_EXP_QUEUE`/`RMQ_EXP_EXCHANGE` |
| AI | `GEMINI_API_KEY`, `OPENAI_API_KEY`, `RANKING_PROVIDER`, `FASTAPI_URL`, `HF_TOKEN` |
| Storage | `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET`, `S3_BASE_URL`, `EXPERIENCE_IMAGES_CDN_URL`, `UPLOADS_DIR` |
| Email | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` |
| Logging | `LOG_LEVEL`, `LOG_DIR` |

> Double-check `RMQ_REC_QUEUE`/`RMQ_REC_EXCHANGE` against your deployment's `.env` — `src/config/rmq.constants.ts` reads those exact names, while some `.env` files in the wild use `RMQ_RECOMMENDATION_QUEUE` instead, which the code will silently ignore in favor of the hardcoded default.

---

## Project Setup

```bash
# install dependencies
npm install

# build (verifies the whole project compiles)
npm run build

# start the API server — http://localhost:3002, Swagger at /api-docs, Bull Board at /admin/queues
npm run start

# start the worker process — consumes RabbitMQ, must run alongside the API for
# mood analysis / recommendations / AI experience generation to complete
npm run start:worker

# generate a new TypeORM migration after changing an entity
npx typeorm migration:generate -n MigrationName

# apply migrations in production
npm run migration:run:prod
```

Requires a reachable PostgreSQL instance, MongoDB instance, Redis instance, and RabbitMQ broker — see [`.env.example`](.env.example) for every variable that needs a value. Locally, the quickest way to get RabbitMQ/Redis running is:

```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
docker run -d --name redis -p 6379:6379 redis
```

No Dockerfile/docker-compose/CI workflow exists in this repository — deployment tooling for this service lives outside this repo today.

---

## Known Gaps / Next Planned Work

| Item | Notes |
|---|---|
| Rate limiting disabled | `ThrottlerModule` is fully configured but commented out in `src/app.module.ts` — see [Scale](#scale-current-capacity--where-overflow-goes) |
| No `test` / `test:e2e` / `start:dev` npm scripts | Jest, ts-jest, and supertest are installed but `package.json` has no script to run them; `test/jest-e2e.json` exists with no `*.e2e-spec.ts` files behind it yet |
| Legacy duplicate experience controller | `src/experience/experience.controller.ts` overlaps with the newer `controllers/experience.host/public/user.controller.ts` split — both are currently registered |
| `POST /notification` role check is inert | `@Roles('host')` is set on the handler but `RolesGuard` isn't in that route's `@UseGuards(...)`, so the role restriction doesn't actually run — see [src/notification/README.md](src/notification/README.md) |
| Feedback reminder cron expression | `@Cron('0 */19999 * * * *')` in `src/feedback/jobs/feedback.cron.ts` doesn't match its "every 5 min" comment — worth re-checking before relying on it |
| Embedding-based recommendation path unused | `RecommendationService.generateForUser()` (embedding + LLM rerank) exists and works but nothing currently calls it — only the mood-based path is wired to a controller/worker |
| Hybrid Recommendation Engine | Planned: merge emotion-based + embedding-based results with scored deduplication |
| Participant Matchmaking / Engagement Analytics | `idealParticipantTraits` and `engagementStats` fields already exist on `Experience` for this, not yet consumed |
| Extended RMQ domains | Architecture supports adding `FEEDBACK`/`BOOKINGS` domains the same way the existing five were added |
