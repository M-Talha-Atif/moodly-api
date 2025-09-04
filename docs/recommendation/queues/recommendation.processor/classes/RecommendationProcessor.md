[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [recommendation/queues/recommendation.processor](../README.md) / RecommendationProcessor

# Class: RecommendationProcessor

Defined in: [src/recommendation/queues/recommendation.processor.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.processor.ts#L8)

## Constructors

### Constructor

> **new RecommendationProcessor**(`recommendationService`, `recommendationGateway`): `RecommendationProcessor`

Defined in: [src/recommendation/queues/recommendation.processor.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.processor.ts#L9)

#### Parameters

##### recommendationService

[`RecommendationService`](../../../recommendation.service/classes/RecommendationService.md)

##### recommendationGateway

[`RecommendationGateway`](../../../recommendation.gateway/classes/RecommendationGateway.md)

#### Returns

`RecommendationProcessor`

## Methods

### handleGenerateRecommendation()

> **handleGenerateRecommendation**(`job`): `Promise`\<`boolean`\>

Defined in: [src/recommendation/queues/recommendation.processor.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/queues/recommendation.processor.ts#L15)

#### Parameters

##### job

`Job`

#### Returns

`Promise`\<`boolean`\>
