# Experience Module

`src/experience` — the bookable "experience" domain (wellness events hosts create and users discover/book). Endpoints are split by audience (host / user / public) rather than one controller branching internally on role.

## Structure

```
experience/
├── experience.module.ts
├── experience.controller.ts              # legacy combined controller — still registered
├── experience.gateway.ts                 # Socket.IO: live spot-count updates
├── experience-recommendation.service.ts  # emotion-based experience matching (used by recommendation module)
├── controllers/
│   ├── experience.host.controller.ts     # @Controller('host/experiences')
│   ├── experience.public.controller.ts   # @Controller('public/experiences')
│   └── experience.user.controller.ts     # @Controller('user/experiences')
├── services/
│   ├── experience.service.ts
│   ├── experience-filter.service.ts
│   └── host/
│       ├── experience-host.service.ts
│       └── ai-experience.service.ts      # Gemini: voice/text → structured experience fields
├── dto/host/
└── entities/
    └── experience.entity.ts
```

> `experience.controller.ts` (legacy, combined) and the `controllers/experience.*.controller.ts` split are **both currently registered** in `experience.module.ts`, producing some overlapping routes under `/experiences/*` alongside `/host|user|public/experiences/*`. Prefer the split controllers below for new integrations.

## Entity notes

`Experience`: title, description, date, location, image, `isVirtual`, `sessionStart/EndTime`, price, timezone, `totalSpots`/`spotsFilled`, meetingLink, cancellationPolicy, `aiPrep`/`testimonials`/`preparation` (jsonb), `targetEmotions`/`desiredOutcomes`/`culturalTags` (arrays — see `Emotions.md` at repo root for the taxonomy), `growthDimensions`, `experienceOutcomeSummary`, `idealParticipantTraits`, `engagementStats` (jsonb), `host` (ManyToOne `User`).

## AI generation

`POST /host/experiences/generate` accepts a voice recording or free text and runs it through Gemini (`AiExperienceService`, `src/common/services/gemini.service.ts`) to produce structured experience fields synchronously. The same generation logic also runs **asynchronously** via the `experience.generate_ai` RabbitMQ event, consumed by `ExperienceWorker` (`src/worker/experience.worker.ts`) — see [root README](../../README.md#event-driven-architecture-rabbitmq).

## Real-time spots

`ExperienceGateway` maintains a Socket.IO room per experience (`experience_<id>`). Clients emit `join-experience` to subscribe; the server emits `spots-update` whenever a booking or cancellation changes `spotsFilled` (see [booking module](../booking/README.md)).

## Endpoints

### Host — `@Controller('host/experiences')`, `JwtCookieGuard, JwtBearerGuard, RolesGuard` (role `host`)

| Method | Route | Description |
|---|---|---|
| POST | `/host/experiences` | Create an experience |
| POST | `/host/experiences/generate` | AI-generate experience fields from voice or text (Gemini) |
| POST | `/host/experiences/:id/image` | Upload experience image to S3 |
| PUT | `/host/experiences/:id` | Update (owner-only) |
| DELETE | `/host/experiences/:id` | Delete (owner-only) |
| GET | `/host/experiences` | List the host's experiences (filtered/paginated) |
| GET | `/host/experiences/:id` | Get a single experience (host-owned) |
| GET | `/host/experiences/:id/bookings` | List bookings for this experience |

### Public — `@Controller('public/experiences')`, no guard

| Method | Route | Description |
|---|---|---|
| GET | `/public/experiences` | Public filtered/paginated listing |

### User — `@Controller('user/experiences')`, `JwtBearerGuard, JwtCookieGuard, RolesGuard` (role `user`)

| Method | Route | Description |
|---|---|---|
| GET | `/user/experiences` | Listing with booking-aware filters |
| GET | `/user/experiences/:id` | Single experience, including the caller's booking status |

### Legacy combined — `@Controller('experiences')`

| Method | Route | Role | Description |
|---|---|---|---|
| POST | `/experiences` | host | Create experience |
| POST | `/experiences/:id/upload-image` | host | Upload image (multipart → S3) |
| PUT | `/experiences/:id` | host | Update (owner-only) |
| DELETE | `/experiences/:id` | host | Delete (owner-only) |
| GET | `/experiences/public` | – | Public listing w/ filters |
| GET | `/experiences/user` | user | User-scoped listing |
| GET | `/experiences/:id` | user | Single experience + booking status |
