[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [feedback/jobs/feedback.cron](../README.md) / FeedbackCron

# Class: FeedbackCron

Defined in: [src/feedback/jobs/feedback.cron.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/jobs/feedback.cron.ts#L10)

## Constructors

### Constructor

> **new FeedbackCron**(`expRepo`, `queue`): `FeedbackCron`

Defined in: [src/feedback/jobs/feedback.cron.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/jobs/feedback.cron.ts#L11)

#### Parameters

##### expRepo

`Repository`\<[`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)\>

##### queue

`Queue`

#### Returns

`FeedbackCron`

## Methods

### enqueueEndedExperiences()

> **enqueueEndedExperiences**(): `Promise`\<`void`\>

Defined in: [src/feedback/jobs/feedback.cron.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/jobs/feedback.cron.ts#L18)

#### Returns

`Promise`\<`void`\>
