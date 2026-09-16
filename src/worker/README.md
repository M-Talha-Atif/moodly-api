# Worker Module (separate process)

`src/worker`: **not** part of the API process. This is a standalone Nest application, bootstrapped by its own `main.ts`, that does nothing but consume RabbitMQ events. Run it alongside the API with `npm run start:worker` (API: `npm run start`). See [root README > Event-Driven Architecture](../../README.md#event-driven-architecture-rabbitmq) for the full picture.

## Structure

```
worker/
├── worker.module.ts             # imports DatabaseModule, RmqModule x4, EmbeddingModule,
│                                 # UsersModule, RecommendationModule, ExperienceModule, CommonModule
├── worker.constants.ts          # WORKER_HTTP_PORT, WORKER_PREFETCH_COUNT
├── main.ts                       # bootstraps WorkerModule, opens 5 RMQ microservice connections,
│                                 # also listens on HTTP port 3001 (health-check only: no real controllers besides the event handlers below)
├── embedding.worker.ts           # @EventPattern('mood.analyzed'), @EventPattern('community.embedding.generate')
├── recommendation.worker.ts      # @EventPattern('recommendation.generate')
├── onboarding.worker.ts          # @EventPattern('onboarding.completed')
└── experience.worker.ts          # @EventPattern('experience.generate_ai')
```

## Why a separate process

Embedding generation and Gemini-based experience-field generation both call an external inference service, which can take real time per request. Running that work in the same process as the HTTP API would mean a slow inference call could starve the event loop that's also trying to serve unrelated HTTP requests. Splitting it into its own process keeps the API responsive regardless of how backed-up that work gets.

Mood detection used to live here too (`mood-detection.worker.ts`, listening for `mood.detect`), but that path was removed: `POST /v1/mood-log` now calls `EmotionAnalysisService` and `ExperienceRecommendationService` directly and returns the real result in the response, see [mood-log README](../mood-log/README.md). That's a deliberate latency-for-immediacy tradeoff on the mood-log endpoint specifically, not a reversal of the rationale above for the handlers that remain.

## Connections

`main.ts` still opens 5 RabbitMQ connections (mood, community, recommendation, onboarding, experience) each with `prefetchCount: WORKER_PREFETCH_COUNT` (1), meaning the worker processes at most one message per domain at a time before acknowledging and pulling the next. The mood connection currently has no handler bound to it (`mood.detect` is no longer emitted anywhere, and `mood.analyzed`, handled by `embedding.worker.ts`, is not emitted by anything either), left in place rather than torn out since `embedding.worker.ts` still declares that `@EventPattern`. This process also opens its **own** Postgres and Mongo connection pools (it imports the same `DatabaseModule` as the API, but as a separate OS process it does not share the API's pool): see [root README > Scale](../../README.md#scale-current-capacity-and-where-overflow-goes).

> The Experience RMQ connection's `exchange` reads `RMQ_ONBOARDING_EXCHANGE` instead of an experience-specific variable, likely a copy-paste slip. Harmless as long as both fall back to their own distinct hardcoded defaults, but would misroute if `RMQ_ONBOARDING_EXCHANGE` is ever set to a custom value in `.env`. Flagged in `main.ts`, not fixed, since correcting it changes runtime routing behavior.

## Event handlers

| File | Listens for | Does | Emits next |
|---|---|---|---|
| `embedding.worker.ts` | `mood.analyzed`, `community.embedding.generate` | Generates and stores vector embeddings in Mongo | – |
| `recommendation.worker.ts` | `recommendation.generate` | Runs `RecommendationService.generateForUserByMood`, pushes results over Socket.IO | – |
| `onboarding.worker.ts` | `onboarding.completed` | Sets `user.onboardingCompleted = true` in Postgres | – |
| `experience.worker.ts` | `experience.generate_ai` | Runs Gemini-based experience-field generation, saves onto the `Experience` row | – |

No handler here currently emits `mood.analyzed`, `recommendation.generate`, `experience.generate_ai`, or `onboarding.completed`: `experience.generate_ai` and `onboarding.completed` are produced by API-side services (`AiExperienceService`, the onboarding completion flow) outside this module; `mood.analyzed` and `recommendation.generate` have no current producer at all, so `embedding.worker.ts`'s mood-analyzed handler and all of `recommendation.worker.ts` are dormant until something emits those events again.
