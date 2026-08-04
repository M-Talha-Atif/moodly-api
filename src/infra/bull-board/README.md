# Bull Board Module

`src/infra/bull-board`: mounts the [Bull Board](https://github.com/felixmosh/bull-board) admin UI so BullMQ/Bull job queues can be inspected (pending, active, completed, and failed jobs, retries) without a database client.

## Structure

```
bull-board/
├── bull-board.module.ts   # BullModule.registerQueue('mood-queue'), visibility only
└── bull-board.ts           # setupBullBoard(queues), wires BullMQAdapter + ExpressAdapter
```

## How it's wired

`src/main.ts` (not this module) creates three `bullmq` `Queue` instances directly: `mood-queue`, `recommendation-queue`, `notification-queue`, connected to `REDIS_URL` (throws at boot if unset). It then calls `setupBullBoard([...])` from `bull-board.ts` and mounts the resulting router at `/admin/queues` on the Express instance underlying the Nest app.

> Two different queue libraries are involved. `main.ts` and this module use the modern `bullmq` package directly (for board visibility), while the actual job **processors** for `notification-queue` and `feedback-request` are registered through `@nestjs/bull` (a NestJS wrapper around the older `bull` package), see [notification](../../notification/README.md) and [feedback](../../feedback/README.md). Both point at the same Redis-backed queues, so they interoperate, but keep this in mind if you add a new queue: follow the `@nestjs/bull` `@Processor`/`@Process` pattern used by the existing processors, not the raw `bullmq` API used here.

## Access

`GET /admin/queues`: no guard is applied to this route in `main.ts`. Treat it as an internal/ops tool and don't expose it publicly without adding auth in front of it.
