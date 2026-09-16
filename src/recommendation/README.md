# Recommendation Module

`src/recommendation`: matches users to experiences based on detected mood (active path) or embedding similarity with optional LLM reranking (implemented, not yet wired to a controller).

## Structure

```
recommendation/
├── recommendation.module.ts
├── recommendation.constants.ts    # result limits, ANN candidate pool size, LLM ranking temperature
├── recommendation.controller.ts   # @Controller('recommendations')
├── recommendation.gateway.ts      # Socket.IO push, per-user socket keyed by ?userId=
├── services/
│   ├── recommendation.service.ts   # generateForUserByMood (active) / generateForUser (embedding+LLM, unused)
│   └── llm-ranking.service.ts      # resolves RANKING_PROVIDER → openai | gemini
├── providers/
│   ├── openai-ranking.provider.ts  # gpt-4o-mini
│   └── gemini-ranking.provider.ts  # gemini-1.5-flash
├── interfaces/
│   └── ranking-provider.interface.ts
└── utils/
    └── cache-key.util.ts
```

## Two matching paths

1. **`generateForUserByMood(userId, mood, limit)`**: the active path. Used by `GET /v1/recommendations`, and `ExperienceRecommendationService.recommendByEmotion` itself (the same underlying matcher) is called directly and synchronously by `POST /v1/mood-log` (see [mood-log README](../mood-log/README.md)), so a fresh mood log's response already carries matching experiences. `RecommendationWorker` still exists for the same matching logic, but nothing currently emits `recommendation.generate`, so it's dormant, see [worker README](../worker/README.md).
2. **`generateForUser(userId, embedding, context)`**: embedding/ANN-based matching (`recommendByEmbedding`, MongoDB `$vectorSearch`) with optional LLM reranking via `LlmRankingService` (provider chosen by `RANKING_PROVIDER` env var) and Redis caching until midnight. Fully implemented but **not currently called from any controller or worker**: a secondary path available for future use (e.g. the planned Hybrid Recommendation Engine, see root README).

## Endpoints

`@Controller('recommendations')`, `JwtBearerGuard, JwtCookieGuard, RolesGuard`, `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| GET | `/v1/recommendations` | Fetches the caller's most recent mood log (`finalMood`, falling back to `moodLabel`, then `neutral`) and returns matching experiences via `generateForUserByMood` |

## Real-time push

`RecommendationGateway` (Socket.IO, maps each connected socket to a `userId` from the connection's `?userId=` query param) still exists and `RecommendationWorker` still pushes through it on `recommendation.generate`, but nothing in the codebase emits that event anymore: `POST /v1/mood-log` now returns recommendations directly in its HTTP response instead of triggering an async push, see [mood-log README](../mood-log/README.md) and [worker README](../worker/README.md).
