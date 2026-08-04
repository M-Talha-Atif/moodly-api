# RMQ Module

`src/rmq` — a `DynamicModule` factory that wraps `@nestjs/microservices`' `ClientsModule` to register a named RabbitMQ producer client bound to one exchange + queue. Used by any module that needs to `emit()` events onto RabbitMQ (see [root README > Event-Driven Architecture](../../README.md#event-driven-architecture-rabbitmq)).

## Structure

```
rmq/
└── rmq.module.ts   # RmqModule.register({ clientName, exchange, queue, exchangeType?, url? })
```

## Usage pattern

```ts
// in a feature module:
RmqModule.register({
  clientName: RMQ_DOMAINS.MOOD.CLIENT,
  exchange: RMQ_DOMAINS.MOOD.EXCHANGE,
  queue: RMQ_DOMAINS.MOOD.QUEUE,
})

// in a service:
constructor(@Inject(RMQ_DOMAINS.MOOD.CLIENT) private rmqClient: ClientProxy) {}
this.rmqClient.emit(RMQ_DOMAINS.MOOD.ROUTING.DETECT, payload);
```

`exchangeType` defaults to `'direct'`; the queue is always declared `durable: true`. The connection URL defaults to `process.env.RABBITMQ_URL` (or `amqp://localhost:5672` if unset).

The domain → exchange/queue/routing-key mapping lives in `src/config/rmq.constants.ts` (`RMQ_DOMAINS`), imported wherever a client needs to be registered or a routing key needs to be emitted/consumed. See [worker module](../worker/README.md) for the consumer side.
