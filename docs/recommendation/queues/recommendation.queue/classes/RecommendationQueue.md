[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [recommendation/queues/recommendation.queue](../README.md) / RecommendationQueue

# Class: RecommendationQueue

Defined in: [src/recommendation/queues/recommendation.queue.ts:7](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.queue.ts#L7)

## Constructors

### Constructor

> **new RecommendationQueue**(`queue`): `RecommendationQueue`

Defined in: [src/recommendation/queues/recommendation.queue.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.queue.ts#L8)

#### Parameters

##### queue

`Queue`

#### Returns

`RecommendationQueue`

## Methods

### enqueueGenerateJob()

> **enqueueGenerateJob**(`userId`, `embedding`): `Promise`\<`void`\>

Defined in: [src/recommendation/queues/recommendation.queue.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.queue.ts#L10)

#### Parameters

##### userId

`string`

##### embedding

`number`[]

#### Returns

`Promise`\<`void`\>
