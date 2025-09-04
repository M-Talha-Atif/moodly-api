[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [config/rmq.constants](../README.md) / RMQ\_DOMAINS

# Variable: RMQ\_DOMAINS

> `const` **RMQ\_DOMAINS**: `object`

Defined in: [src/config/rmq.constants.ts:2](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/config/rmq.constants.ts#L2)

## Type Declaration

### COMMUNITY

> **COMMUNITY**: `object`

#### COMMUNITY.CLIENT

> **CLIENT**: `string` = `'COMM_RMQ_CLIENT'`

#### COMMUNITY.EXCHANGE

> **EXCHANGE**: `string`

#### COMMUNITY.QUEUE

> **QUEUE**: `string`

#### COMMUNITY.ROUTING

> **ROUTING**: `object`

#### COMMUNITY.ROUTING.EMBED

> **EMBED**: `string` = `'community.embedding.generate'`

### EXPERIENCE

> **EXPERIENCE**: `object` = `{}`

### MOOD

> **MOOD**: `object`

#### MOOD.CLIENT

> **CLIENT**: `string` = `'MOOD_RMQ_CLIENT'`

#### MOOD.EXCHANGE

> **EXCHANGE**: `string`

#### MOOD.QUEUE

> **QUEUE**: `string`

#### MOOD.ROUTING

> **ROUTING**: `object`

#### MOOD.ROUTING.ANALYZED

> **ANALYZED**: `string` = `'mood.analyzed'`

#### MOOD.ROUTING.DETECT

> **DETECT**: `string` = `'mood.detect'`
