[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [experience/experience.gateway](../README.md) / ExperienceGateway

# Class: ExperienceGateway

Defined in: [src/experience/experience.gateway.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L23)

## Implements

- `OnGatewayConnection`
- `OnGatewayDisconnect`

## Constructors

### Constructor

> **new ExperienceGateway**(): `ExperienceGateway`

#### Returns

`ExperienceGateway`

## Properties

### server

> **server**: `Server`

Defined in: [src/experience/experience.gateway.ts:28](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L28)

## Methods

### emitSpotsUpdate()

> **emitSpotsUpdate**(`experienceId`, `spotsLeft`): `void`

Defined in: [src/experience/experience.gateway.ts:78](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L78)

This is NOT triggered by clients.
This is a "server → client" push method that YOU can call from services.

Example: after someone books/cancels, BookingService/BookingCreationService can call
this.emitSpotsUpdate(experienceId, newSpotsLeft)

🔥 This will notify ONLY users in the corresponding experience room

#### Parameters

##### experienceId

`string`

##### spotsLeft

`number`

#### Returns

`void`

---

### handleConnection()

> **handleConnection**(`client`): `void`

Defined in: [src/experience/experience.gateway.ts:34](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L34)

Triggered when a client establishes a WebSocket connection
Equivalent of "on connect" in socket.io

#### Parameters

##### client

`Socket`

#### Returns

`void`

#### Implementation of

`OnGatewayConnection.handleConnection`

---

### handleDisconnect()

> **handleDisconnect**(`client`): `void`

Defined in: [src/experience/experience.gateway.ts:42](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L42)

Triggered when a client disconnects (closes browser, refresh, network drop, etc.)

#### Parameters

##### client

`Socket`

#### Returns

`void`

#### Implementation of

`OnGatewayDisconnect.handleDisconnect`

---

### handleJoinExperience()

> **handleJoinExperience**(`data`, `client`): `void`

Defined in: [src/experience/experience.gateway.ts:55](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.gateway.ts#L55)

Handles when a client wants to "join" a specific experience room.
Example: user clicks into an experience detail page → client emits 'join-experience'

- client joins a room (socket.io group channel)
- room name convention: "experience\_<experienceId>"
- Later, we can emit events ONLY to users in this room

#### Parameters

##### data

###### experienceId

`string`

##### client

`Socket`

#### Returns

`void`
