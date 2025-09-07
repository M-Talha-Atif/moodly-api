[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [feedback/feedback.controller](../README.md) / FeedbackController

# Class: FeedbackController

Defined in: [src/feedback/feedback.controller.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L29)

## Constructors

### Constructor

> **new FeedbackController**(`feedbackService`, `pendingFeedbackService`): `FeedbackController`

Defined in: [src/feedback/feedback.controller.ts:30](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L30)

#### Parameters

##### feedbackService

[`FeedbackService`](../../feedback.service/classes/FeedbackService.md)

##### pendingFeedbackService

[`PendingFeedbackService`](../../pending-feedback.service/classes/PendingFeedbackService.md)

#### Returns

`FeedbackController`

## Methods

### create()

> **create**(`experienceId`, `dto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null` \| [`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>\>

Defined in: [src/feedback/feedback.controller.ts:48](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L48)

#### Parameters

##### experienceId

`string`

##### dto

[`CreateFeedbackDto`](../../dto/create-feedback.dto/classes/CreateFeedbackDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null` \| [`Feedback`](../../entities/feedback.entity/classes/Feedback.md)\>\>

---

### getAll()

> **getAll**(`experienceId`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)[]\>\>

Defined in: [src/feedback/feedback.controller.ts:74](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L74)

#### Parameters

##### experienceId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`Feedback`](../../entities/feedback.entity/classes/Feedback.md)[]\>\>

---

### getPending()

> **getPending**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`PendingFeedback`](../../entities/pending-feedback.entity/classes/PendingFeedback.md)[]\>\>

Defined in: [src/feedback/feedback.controller.ts:88](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L88)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`PendingFeedback`](../../entities/pending-feedback.entity/classes/PendingFeedback.md)[]\>\>

---

### removePending()

> **removePending**(`req`, `id`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>\>

Defined in: [src/feedback/feedback.controller.ts:106](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/feedback/feedback.controller.ts#L106)

#### Parameters

##### req

`any`

##### id

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>\>
