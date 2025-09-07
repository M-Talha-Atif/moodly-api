[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [feedback/queues/feedback-request.processor](../README.md) / FeedbackRequestProcessor

# Class: FeedbackRequestProcessor

Defined in: [src/feedback/queues/feedback-request.processor.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/queues/feedback-request.processor.ts#L6)

## Constructors

### Constructor

> **new FeedbackRequestProcessor**(`pendingFeedbackService`): `FeedbackRequestProcessor`

Defined in: [src/feedback/queues/feedback-request.processor.ts:7](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/queues/feedback-request.processor.ts#L7)

#### Parameters

##### pendingFeedbackService

[`PendingFeedbackService`](../../../pending-feedback.service/classes/PendingFeedbackService.md)

#### Returns

`FeedbackRequestProcessor`

## Methods

### handle()

> **handle**(`job`): `Promise`\<`void`\>

Defined in: [src/feedback/queues/feedback-request.processor.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/queues/feedback-request.processor.ts#L12)

#### Parameters

##### job

`Job`\<\{ `experienceId`: `string`; `userId`: `string`; \}\>

#### Returns

`Promise`\<`void`\>
