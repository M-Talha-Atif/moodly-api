[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [onboarding/onboarding.controller](../README.md) / OnboardingController

# Class: OnboardingController

Defined in: [src/onboarding/onboarding.controller.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L17)

## Constructors

### Constructor

> **new OnboardingController**(`onboardingService`): `OnboardingController`

Defined in: [src/onboarding/onboarding.controller.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L18)

#### Parameters

##### onboardingService

[`OnboardingService`](../../onboarding.service/classes/OnboardingService.md)

#### Returns

`OnboardingController`

## Methods

### activities()

> **activities**(`req`, `dto`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

Defined in: [src/onboarding/onboarding.controller.ts:46](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L46)

#### Parameters

##### req

`any`

##### dto

[`SetActivitiesDto`](../../dto/onboarding.dto/classes/SetActivitiesDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

---

### answer()

> **answer**(`req`, `dto`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

Defined in: [src/onboarding/onboarding.controller.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L29)

#### Parameters

##### req

`any`

##### dto

[`AnswerQuestionDto`](../../dto/onboarding.dto/classes/AnswerQuestionDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

---

### complete()

> **complete**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

Defined in: [src/onboarding/onboarding.controller.ts:56](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L56)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

---

### goals()

> **goals**(`req`, `dto`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

Defined in: [src/onboarding/onboarding.controller.ts:39](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L39)

#### Parameters

##### req

`any`

##### dto

[`SetGoalsDto`](../../dto/onboarding.dto/classes/SetGoalsDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>\>

---

### start()

> **start**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md)\>\>

Defined in: [src/onboarding/onboarding.controller.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L22)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md)\>\>

---

### status()

> **status**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `activities?`: `undefined`; `completed?`: `undefined`; `currentStep?`: `undefined`; `goals?`: `undefined`; `started`: `boolean`; \} \| \{ `activities`: `string`[]; `completed`: `boolean`; `currentStep`: `number`; `goals`: `string`[]; `started`: `boolean`; \}\>\>

Defined in: [src/onboarding/onboarding.controller.ts:63](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.controller.ts#L63)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `activities?`: `undefined`; `completed?`: `undefined`; `currentStep?`: `undefined`; `goals?`: `undefined`; `started`: `boolean`; \} \| \{ `activities`: `string`[]; `completed`: `boolean`; `currentStep`: `number`; `goals`: `string`[]; `started`: `boolean`; \}\>\>
