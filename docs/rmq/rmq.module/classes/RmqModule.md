[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [rmq/rmq.module](../README.md) / RmqModule

# Class: RmqModule

Defined in: [src/rmq/rmq.module.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/rmq/rmq.module.ts#L6)

## Constructors

### Constructor

> **new RmqModule**(): `RmqModule`

#### Returns

`RmqModule`

## Methods

### register()

> `static` **register**(`params`): `DynamicModule`

Defined in: [src/rmq/rmq.module.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/rmq/rmq.module.ts#L11)

Register a named RabbitMQ client bound to a specific exchange + queue.
Routing keys are specified when emitting (ClientProxy.emit(pattern, data)).

#### Parameters

##### params

###### clientName

`string`

###### exchange

`string`

###### exchangeType?

`"headers"` \| `"direct"` \| `"topic"` \| `"fanout"`

###### queue

`string`

###### url?

`string`

#### Returns

`DynamicModule`
