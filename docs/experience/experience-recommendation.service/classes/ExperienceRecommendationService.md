[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [experience/experience-recommendation.service](../README.md) / ExperienceRecommendationService

# Class: ExperienceRecommendationService

Defined in: [src/experience/experience-recommendation.service.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience-recommendation.service.ts#L10)

## Constructors

### Constructor

> **new ExperienceRecommendationService**(`experienceRepo`, `experienceEmbeddingModel`): `ExperienceRecommendationService`

Defined in: [src/experience/experience-recommendation.service.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience-recommendation.service.ts#L11)

#### Parameters

##### experienceRepo

`Repository`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>

##### experienceEmbeddingModel

`Model`\<[`ExperienceEmbedding`](../../../embedding/schemas/experience-embedding.schema/classes/ExperienceEmbedding.md)\>

#### Returns

`ExperienceRecommendationService`

## Methods

### recommend()

> **recommend**(`userEmbedding`, `limit`): `Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)[]\>

Defined in: [src/experience/experience-recommendation.service.ts:19](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience-recommendation.service.ts#L19)

#### Parameters

##### userEmbedding

`number`[]

##### limit

`number` = `10`

#### Returns

`Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)[]\>
