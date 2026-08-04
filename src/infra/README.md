# Infrastructure Modules

`src/infra` groups the modules that provide cross-cutting technical plumbing (caching, messaging, background-job monitoring, static config) rather than product/domain logic. Nothing under here has an opinion about users, bookings, or mood, it just gives the domain modules in `src/` a place to talk to Redis, RabbitMQ, and BullMQ.

| Folder | Provides | README |
|---|---|---|
| `redis/` | `RedisService`, a shared `ioredis` client with get/set/del and a distributed-lock helper | [redis/README.md](redis/README.md) |
| `rmq/` | `RmqModule.register(...)`, a factory for RabbitMQ producer clients | [rmq/README.md](rmq/README.md) |
| `config/` | `RMQ_DOMAINS`, the exchange/queue/routing-key map RabbitMQ producers and consumers both read from | [config/README.md](config/README.md) |
| `bull-board/` | Mounts the Bull Board admin UI at `/admin/queues` for inspecting BullMQ/Bull jobs | [bull-board/README.md](bull-board/README.md) |

See the root [README](../../README.md) for how these pieces fit into the overall event-driven and background-job architecture.
