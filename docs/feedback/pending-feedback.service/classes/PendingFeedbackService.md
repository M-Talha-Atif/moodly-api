[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [feedback/pending-feedback.service](../README.md) / PendingFeedbackService

# Class: PendingFeedbackService

Defined in: [src/feedback/pending-feedback.service.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L10)

## Constructors

### Constructor

> **new PendingFeedbackService**(`pendingRepo`, `feedbackRepo`, `experienceService`): `PendingFeedbackService`

Defined in: [src/feedback/pending-feedback.service.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L11)

#### Parameters

##### pendingRepo

`Repository`\<[`PendingFeedback`](../../entities/pending-feedback.entity/classes/PendingFeedback.md)\>

##### feedbackRepo

`Repository`\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>

##### experienceService

[`ExperienceService`](../../../experience/experience.service/classes/ExperienceService.md)

#### Returns

`PendingFeedbackService`

## Methods

### cleanupStaleForUser()

> **cleanupStaleForUser**(`userId`): `Promise`\<`void`\>

Defined in: [src/feedback/pending-feedback.service.ts:72](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L72)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`void`\>

***

### create()

> **create**(`userId`, `experienceId`): `Promise`\<`void`\>

Defined in: [src/feedback/pending-feedback.service.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L25)

#### Parameters

##### userId

`string`

##### experienceId

`string`

#### Returns

`Promise`\<`void`\>

***

### deleteById()

> **deleteById**(`userId`, `pendingId`): `Promise`\<`DeleteResult`\>

Defined in: [src/feedback/pending-feedback.service.ts:67](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L67)

#### Parameters

##### userId

`string`

##### pendingId

`string`

#### Returns

`Promise`\<`DeleteResult`\>

***

### findForUser()

> **findForUser**(`userId`): `Promise`\<[`PendingFeedback`](../../entities/pending-feedback.entity/classes/PendingFeedback.md)[]\>

Defined in: [src/feedback/pending-feedback.service.ts:63](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/pending-feedback.service.ts#L63)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`PendingFeedback`](../../entities/pending-feedback.entity/classes/PendingFeedback.md)[]\>
