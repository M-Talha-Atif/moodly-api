# Embedding Module

`src/embedding` — thin wrapper around the FastAPI `/embed` endpoint plus MongoDB storage for the resulting vectors. No HTTP controller of its own; consumed internally by the recommendation engine and the worker process.

## Structure

```
embedding/
├── embedding.module.ts
├── schemas/                          # Mongoose schemas, one per domain that gets embedded
│   ├── experience-embedding.schema.ts
│   ├── moodlog-embedding.schema.ts
│   ├── community-embedding.schema.ts
│   └── post-embedding.schema.ts
└── services/
    ├── embedding.service.ts           # calls FastAPI POST /embed, returns a 384-dim vector
    ├── user-embedding.service.ts      # user-level embedding aggregation
    └── user-mood-embedding.service.ts
```

## How it's used

- `EmbeddingService.embed(text)` calls the external FastAPI inference service (`FASTAPI_URL`, model `sentence-transformers/all-MiniLM-L6-v2`) and returns a 384-dimensional `number[]`.
- `embedding.worker.ts` (in [`src/worker`](../worker/README.md)) consumes `mood.analyzed` and `community.embedding.generate` RabbitMQ events and persists the resulting vectors via these schemas.
- Stored vectors back the **embedding-search** path of the recommendation engine (`RecommendationService.generateForUser`) via MongoDB `$vectorSearch` — see [recommendation module](../recommendation/README.md). That path exists and works but is not currently wired to any controller; only the mood-based path is active.
