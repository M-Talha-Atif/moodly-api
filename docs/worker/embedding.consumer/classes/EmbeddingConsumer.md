[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [worker/embedding.consumer](../README.md) / EmbeddingConsumer

# Class: EmbeddingConsumer

Defined in: [src/worker/embedding.consumer.ts:28](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/embedding.consumer.ts#L28)

## Constructors

### Constructor

> **new EmbeddingConsumer**(`embeddingService`, `moodLogEmbeddingModel`, `recQueue`, `communityEmbeddingModel`): `EmbeddingConsumer`

Defined in: [src/worker/embedding.consumer.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/embedding.consumer.ts#L31)

#### Parameters

##### embeddingService

[`EmbeddingService`](../../../embedding/embedding.service/classes/EmbeddingService.md)

##### moodLogEmbeddingModel

`Model`\<[`MoodLogEmbedding`](../../../embedding/schemas/moodlog-embedding.schema/classes/MoodLogEmbedding.md)\>

##### recQueue

`Queue`

##### communityEmbeddingModel

`Model`\<[`CommunityEmbedding`](../../../embedding/schemas/community-embedding.schema/classes/CommunityEmbedding.md)\>

#### Returns

`EmbeddingConsumer`

## Methods

### handleCommunityEmbedding()

> **handleCommunityEmbedding**(`payload`): `Promise`\<`void`\>

Defined in: [src/worker/embedding.consumer.ts:67](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/embedding.consumer.ts#L67)

#### Parameters

##### payload

`CommunityEmbeddingPayload`

#### Returns

`Promise`\<`void`\>

***

### handleMoodAnalyzed()

> **handleMoodAnalyzed**(`payload`): `Promise`\<`void`\>

Defined in: [src/worker/embedding.consumer.ts:42](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/embedding.consumer.ts#L42)

#### Parameters

##### payload

`MoodAnalyzedPayload`

#### Returns

`Promise`\<`void`\>
