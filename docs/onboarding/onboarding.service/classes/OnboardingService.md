[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [onboarding/onboarding.service](../README.md) / OnboardingService

# Class: OnboardingService

Defined in: [src/onboarding/onboarding.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L13)

## Constructors

### Constructor

> **new OnboardingService**(`model`): `OnboardingService`

Defined in: [src/onboarding/onboarding.service.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L14)

#### Parameters

##### model

`Model`\<[`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md)\>

#### Returns

`OnboardingService`

## Methods

### answerQuestion()

> **answerQuestion**(`userId`, `dto`): `Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

Defined in: [src/onboarding/onboarding.service.ts:35](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L35)

#### Parameters

##### userId

`string`

##### dto

[`AnswerQuestionDto`](../../dto/onboarding.dto/classes/AnswerQuestionDto.md)

#### Returns

`Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

***

### complete()

> **complete**(`userId`): `Promise`\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

Defined in: [src/onboarding/onboarding.service.ts:63](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L63)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

***

### findByUserId()

> **findByUserId**(`userId`): `Promise`\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

Defined in: [src/onboarding/onboarding.service.ts:71](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L71)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<`null` \| `Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

***

### getStatus()

> **getStatus**(`userId`): `Promise`\<\{ `activities?`: `undefined`; `completed?`: `undefined`; `currentStep?`: `undefined`; `goals?`: `undefined`; `started`: `boolean`; \} \| \{ `activities`: `string`[]; `completed`: `boolean`; `currentStep`: `number`; `goals`: `string`[]; `started`: `boolean`; \}\>

Defined in: [src/onboarding/onboarding.service.ts:75](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L75)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `activities?`: `undefined`; `completed?`: `undefined`; `currentStep?`: `undefined`; `goals?`: `undefined`; `started`: `boolean`; \} \| \{ `activities`: `string`[]; `completed`: `boolean`; `currentStep`: `number`; `goals`: `string`[]; `started`: `boolean`; \}\>

***

### setActivities()

> **setActivities**(`userId`, `dto`): `Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

Defined in: [src/onboarding/onboarding.service.ts:54](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L54)

#### Parameters

##### userId

`string`

##### dto

[`SetActivitiesDto`](../../dto/onboarding.dto/classes/SetActivitiesDto.md)

#### Returns

`Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

***

### setGoals()

> **setGoals**(`userId`, `dto`): `Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

Defined in: [src/onboarding/onboarding.service.ts:45](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L45)

#### Parameters

##### userId

`string`

##### dto

[`SetGoalsDto`](../../dto/onboarding.dto/classes/SetGoalsDto.md)

#### Returns

`Promise`\<`Document`\<`unknown`, \{ \}, [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md), \{ \}, \{ \}\> & [`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md) & `Required`\<\{ `_id`: `unknown`; \}\> & `object`\>

***

### startOnboarding()

> **startOnboarding**(`userId`): `Promise`\<[`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md)\>

Defined in: [src/onboarding/onboarding.service.ts:19](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/onboarding/onboarding.service.ts#L19)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`UserOnboarding`](../../schemas/user-onboarding.schema/classes/UserOnboarding.md)\>
