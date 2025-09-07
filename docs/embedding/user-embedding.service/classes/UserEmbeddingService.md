[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [embedding/user-embedding.service](../README.md) / UserEmbeddingService

# Class: UserEmbeddingService

Defined in: [src/embedding/user-embedding.service.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/embedding/user-embedding.service.ts#L8)

## Constructors

### Constructor

> **new UserEmbeddingService**(`moodLogEmbeddingModel`): `UserEmbeddingService`

Defined in: [src/embedding/user-embedding.service.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/embedding/user-embedding.service.ts#L9)

#### Parameters

##### moodLogEmbeddingModel

`Model`\<[`MoodLogEmbedding`](../../schemas/moodlog-embedding.schema/classes/MoodLogEmbedding.md)\>

#### Returns

`UserEmbeddingService`

## Methods

### getLatestUserEmbedding()

> **getLatestUserEmbedding**(`userId`): `Promise`\<`null` \| `number`[]\>

Defined in: [src/embedding/user-embedding.service.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/embedding/user-embedding.service.ts#L14)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`null` \| `number`[]\>
