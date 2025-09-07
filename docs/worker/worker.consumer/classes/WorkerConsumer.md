[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [worker/worker.consumer](../README.md) / WorkerConsumer

# Class: WorkerConsumer

Defined in: [src/worker/worker.consumer.ts:19](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/worker.consumer.ts#L19)

## Constructors

### Constructor

> **new WorkerConsumer**(`repo`, `emotion`, `rmqClient`): `WorkerConsumer`

Defined in: [src/worker/worker.consumer.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/worker.consumer.ts#L22)

#### Parameters

##### repo

`Repository`\<[`MoodLog`](../../../mood-log/entities/mood-log.entity/classes/MoodLog.md)\>

##### emotion

[`EmotionAnalysisService`](../../../mood-log/services/emotion-analysis.service/classes/EmotionAnalysisService.md)

##### rmqClient

`ClientProxy`

#### Returns

`WorkerConsumer`

## Methods

### handleMoodDetect()

> **handleMoodDetect**(`payload`): `Promise`\<`void`\>

Defined in: [src/worker/worker.consumer.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/worker/worker.consumer.ts#L29)

#### Parameters

##### payload

`MoodDetectPayload`

#### Returns

`Promise`\<`void`\>
