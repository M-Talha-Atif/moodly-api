[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [mood-log/queues/mood-log-queue.processor](../README.md) / MoodLogQueueProcessor

# Class: MoodLogQueueProcessor

Defined in: [src/mood-log/queues/mood-log-queue.processor.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/queues/mood-log-queue.processor.ts#L11)

## Constructors

### Constructor

> **new MoodLogQueueProcessor**(`embeddingService`, `recommendationQueue`, `moodLogEmbeddingModel`): `MoodLogQueueProcessor`

Defined in: [src/mood-log/queues/mood-log-queue.processor.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/queues/mood-log-queue.processor.ts#L12)

#### Parameters

##### embeddingService

[`EmbeddingService`](../../../../embedding/embedding.service/classes/EmbeddingService.md)

##### recommendationQueue

[`RecommendationQueue`](../../../../recommendation/queues/recommendation.queue/classes/RecommendationQueue.md)

##### moodLogEmbeddingModel

`Model`\<[`MoodLogEmbedding`](../../../../embedding/schemas/moodlog-embedding.schema/classes/MoodLogEmbedding.md)\>

#### Returns

`MoodLogQueueProcessor`

## Methods

### handleMoodLogJob()

> **handleMoodLogJob**(`job`): `Promise`\<`void`\>

Defined in: [src/mood-log/queues/mood-log-queue.processor.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/queues/mood-log-queue.processor.ts#L20)

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<`void`\>
