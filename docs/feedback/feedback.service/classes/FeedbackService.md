[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [feedback/feedback.service](../README.md) / FeedbackService

# Class: FeedbackService

Defined in: [src/feedback/feedback.service.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.service.ts#L17)

## Constructors

### Constructor

> **new FeedbackService**(`feedbackRepository`, `experienceService`, `dataSource`): `FeedbackService`

Defined in: [src/feedback/feedback.service.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.service.ts#L18)

#### Parameters

##### feedbackRepository

`Repository`\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>

##### experienceService

[`ExperienceService`](../../../experience/experience.service/classes/ExperienceService.md)

##### dataSource

`DataSource`

#### Returns

`FeedbackService`

## Methods

### create()

> **create**(`dto`, `userId`, `experienceId`): `Promise`\<`null` \| [`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>

Defined in: [src/feedback/feedback.service.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.service.ts#L26)

#### Parameters

##### dto

[`CreateFeedbackDto`](../../dto/create-feedback.dto/classes/CreateFeedbackDto.md)

##### userId

`string`

##### experienceId

`string`

#### Returns

`Promise`\<`null` \| [`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>

***

### findAllForExperience()

> **findAllForExperience**(`experienceId`): `Promise`\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)[]\>

Defined in: [src/feedback/feedback.service.ts:122](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.service.ts#L122)

#### Parameters

##### experienceId

`string`

#### Returns

`Promise`\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)[]\>
