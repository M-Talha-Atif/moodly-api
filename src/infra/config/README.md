# Config Module

`src/infra/config`: static configuration constants shared across the codebase. Currently a single file, kept as its own folder inside `infra` so future config (feature flags, provider settings) has an obvious home next to it.

## Structure

```
config/
└── rmq.constants.ts   # RMQ_DOMAINS: exchange/queue/routing-key map, one entry per event domain
```

## `RMQ_DOMAINS`

The single source of truth for RabbitMQ topology. Each domain (`MOOD`, `COMMUNITY`, `RECOMMENDATION`, `ONBOARDING`, `EXPERIENCE`) defines:

| Field | Meaning |
|---|---|
| `CLIENT` | Injection token used with `@Inject(RMQ_DOMAINS.X.CLIENT)` to get that domain's `ClientProxy` |
| `EXCHANGE` | Exchange name, overridable via an `RMQ_*_EXCHANGE` env var |
| `QUEUE` | Queue name, overridable via an `RMQ_*_QUEUE` env var |
| `ROUTING` | The routing key(s) producers emit on and consumers listen for |

Both [`RmqModule.register(...)`](../rmq/README.md) (producer side, in feature modules) and [`src/worker/main.ts`](../../worker/README.md) (consumer side) read from this file, so a routing key or queue name only needs to change in one place. See [root README, Event-Driven Architecture](../../../README.md#event-driven-architecture-rabbitmq) for how the domains map onto the actual mood-to-recommendation flow.
