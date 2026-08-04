# Redis Module

`src/redis` — a thin `ioredis` wrapper providing basic caching primitives and a distributed-lock helper. No HTTP controller; injected into other services.

## Structure

```
redis/
├── redis.module.ts
└── redis.service.ts
```

## `RedisService` API

| Method | Description |
|---|---|
| `set(key, value, ttlSeconds?)` | JSON-stringifies and stores a value, optional TTL |
| `get<T>(key)` | Reads and JSON-parses a value, `null` if missing |
| `del(key)` | Deletes a key |
| `acquireLock(key, ttlMs)` | `SET key value PX ttl NX` — returns a lock token on success, `null` if already held |
| `releaseLock(key, lock)` | Lua script: deletes the key only if its value still matches the given lock token (compare-and-delete, avoids releasing someone else's lock after TTL expiry) |

Connects to `REDIS_URL` (falls back to `redis://localhost:6379`), with `maxRetriesPerRequest: 3` and capped exponential backoff on reconnect.

> **Currently unused in practice**: `acquireLock`/`releaseLock` are fully implemented but not called anywhere else in the codebase today. Booking concurrency safety is instead handled at the PostgreSQL layer (`SELECT ... FOR UPDATE` inside a transaction) — see [booking module](../booking/README.md) and [root README > Engineering Challenges](../../README.md#engineering-challenges-handled). These lock primitives are available if a future feature needs cross-process mutual exclusion that a DB row lock can't express.

This is a separate Redis usage from **BullMQ**, which opens its own connections to the same `REDIS_URL` for job queues — see [bull-board module](../bull-board/README.md).
