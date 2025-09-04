[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [recommendation/recommendation.service](../README.md) / RecommendationService

# Class: RecommendationService

Defined in: [src/recommendation/recommendation.service.ts:7](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.service.ts#L7)

## Constructors

### Constructor

> **new RecommendationService**(`experienceRecommendationService`, `redis`): `RecommendationService`

Defined in: [src/recommendation/recommendation.service.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.service.ts#L8)

#### Parameters

##### experienceRecommendationService

[`ExperienceRecommendationService`](../../../experience/experience-recommendation.service/classes/ExperienceRecommendationService.md)

##### redis

[`RedisService`](../../../redis/redis.service/classes/RedisService.md)

#### Returns

`RecommendationService`

## Methods

### generateForUser()

> **generateForUser**(`userId`, `embedding`): `Promise`\<`any`[]\>

Defined in: [src/recommendation/recommendation.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.service.ts#L13)

#### Parameters

##### userId

`string`

##### embedding

`number`[]

#### Returns

`Promise`\<`any`[]\>
