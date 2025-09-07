[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [recommendation/recommendation.gateway](../README.md) / RecommendationGateway

# Class: RecommendationGateway

Defined in: [src/recommendation/recommendation.gateway.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.gateway.ts#L13)

## Implements

- `OnGatewayConnection`
- `OnGatewayDisconnect`

## Constructors

### Constructor

> **new RecommendationGateway**(): `RecommendationGateway`

#### Returns

`RecommendationGateway`

## Properties

### server

> **server**: `Server`

Defined in: [src/recommendation/recommendation.gateway.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.gateway.ts#L17)

## Methods

### handleConnection()

> **handleConnection**(`client`): `void`

Defined in: [src/recommendation/recommendation.gateway.ts:21](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.gateway.ts#L21)

#### Parameters

##### client

`any`

#### Returns

`void`

#### Implementation of

`OnGatewayConnection.handleConnection`

---

### handleDisconnect()

> **handleDisconnect**(`client`): `void`

Defined in: [src/recommendation/recommendation.gateway.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.gateway.ts#L29)

#### Parameters

##### client

`any`

#### Returns

`void`

#### Implementation of

`OnGatewayDisconnect.handleDisconnect`

---

### sendRecommendations()

> **sendRecommendations**(`userId`, `recommendations`): `void`

Defined in: [src/recommendation/recommendation.gateway.ts:39](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/recommendation/recommendation.gateway.ts#L39)

#### Parameters

##### userId

`string`

##### recommendations

`any`[]

#### Returns

`void`
