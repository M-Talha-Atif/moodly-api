# Recommendation Module

`src/recommendation` — matches users to experiences based on detected mood (active path) or embedding similarity with optional LLM reranking (implemented, not yet wired to a controller).

## Structure

```
recommendation/
├── recommendation.module.ts
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

1. **`generateForUserByMood(userId, mood, limit)`** — the active path. Used both by `GET /recommendations` and by `RecommendationWorker` after a mood log finishes analysis. Delegates to `ExperienceRecommendationService.recommendByEmotion` (in [experience module](../experience/README.md)) for direct emotion-tag matching. No LLM call. Redis caching code exists in this path but is currently commented out.
2. **`generateForUser(userId, embedding, context)`** — embedding/ANN-based matching (`recommendByEmbedding`, MongoDB `$vectorSearch`) with optional LLM reranking via `LlmRankingService` (provider chosen by `RANKING_PROVIDER` env var) and Redis caching until midnight. Fully implemented but **not currently called from any controller or worker** — a secondary path available for future use (e.g. the planned Hybrid Recommendation Engine, see root README).

## Endpoints

`@Controller('recommendations')`, `JwtBearerGuard, JwtCookieGuard, RolesGuard`, `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| GET | `/recommendations` | Fetches the caller's most recent mood log (`finalMood`, falling back to `moodLabel`, then `neutral`) and returns matching experiences via `generateForUserByMood` |

## Real-time push

Recommendations generated asynchronously (via the `recommendation.generate` RabbitMQ event, see [root README > Event-Driven Architecture](../../README.md#event-driven-architecture-rabbitmq)) are pushed to the client over `RecommendationGateway`, which maps each connected socket to a `userId` from the connection's `?userId=` query param.
