# Worker Module (separate process)

`src/worker`: **not** part of the API process. This is a standalone Nest application, bootstrapped by its own `main.ts`, that does nothing but consume RabbitMQ events. Run it alongside the API with `npm run start:worker` (API: `npm run start`). See [root README > Event-Driven Architecture](../../README.md#event-driven-architecture-rabbitmq) and the [sample event flow](../../README.md#sample-event-flow--mood-log-to-recommendation) for the full picture.

## Structure

```
worker/
├── worker.module.ts             # imports DatabaseModule, RmqModule x5, EmbeddingModule,
│                                 # UsersModule, RecommendationModule, ExperienceModule, CommonModule
├── main.ts                       # bootstraps WorkerModule, opens 5 RMQ microservice connections,
│                                 # also listens on HTTP port 3001 (health-check only: no real controllers besides the event handlers below)
├── mood-detection.worker.ts      # @EventPattern('mood.detect')
├── embedding.worker.ts           # @EventPattern('mood.analyzed'), @EventPattern('community.embedding.generate')
├── recommendation.worker.ts      # @EventPattern('recommendation.generate')
├── onboarding.worker.ts          # @EventPattern('onboarding.completed')
└── experience.worker.ts          # @EventPattern('experience.generate_ai')
```

## Why a separate process

Emotion analysis and embedding generation both call the external FastAPI inference service, which can take real time per request. Running that work in the same process as the HTTP API would mean a slow inference call could starve the event loop that's also trying to serve unrelated HTTP requests. Splitting it into its own process means the API stays responsive regardless of how backed-up mood analysis gets: the tradeoff is that mood/recommendation results are no longer available synchronously in the request that triggered them; the client needs to receive them later via Socket.IO (see [recommendation module](../recommendation/README.md)) instead of in the original HTTP response.

## Connections

Each of the 5 RabbitMQ connections is opened with `prefetchCount: 1`, meaning the worker processes at most one message per domain at a time before acknowledging and pulling the next: so across all 5 domains, at most 5 events are ever "in flight" concurrently in a single worker instance. This process also opens its **own** Postgres and Mongo connection pools (it imports the same `DatabaseModule` as the API, but as a separate OS process it does not share the API's pool): see [root README > Scale](../../README.md#scale-current-capacity--where-overflow-goes).

## Event handlers

| File | Listens for | Does | Emits next |
|---|---|---|---|
| `mood-detection.worker.ts` | `mood.detect` | Calls FastAPI for photo/voice emotion analysis, writes `finalMood`/`photoEmotion`/`voiceSentiment` back to the `MoodLog` row | `recommendation.generate` |
| `embedding.worker.ts` | `mood.analyzed`, `community.embedding.generate` | Generates and stores vector embeddings in Mongo | – |
| `recommendation.worker.ts` | `recommendation.generate` | Runs `RecommendationService.generateForUserByMood`, pushes results over Socket.IO | – |
| `onboarding.worker.ts` | `onboarding.completed` | Sets `user.onboardingCompleted = true` in Postgres | – |
| `experience.worker.ts` | `experience.generate_ai` | Runs Gemini-based experience-field generation, saves onto the `Experience` row | – |

No handler here emits `mood.detect`, `mood.analyzed`, `experience.generate_ai`, or `onboarding.completed`: those are produced by API-side services (`MoodLogService`, `AiExperienceService`, the onboarding completion flow) outside this module.
