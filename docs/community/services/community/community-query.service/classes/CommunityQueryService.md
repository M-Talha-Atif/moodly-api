[**ai-moodler-backend v0.0.1**](../../../../../README.md)

---

[ai-moodler-backend](../../../../../README.md) / [community/services/community/community-query.service](../README.md) / CommunityQueryService

# Class: CommunityQueryService

Defined in: [src/community/services/community/community-query.service.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-query.service.ts#L11)

## Constructors

### Constructor

> **new CommunityQueryService**(`communityRepository`): `CommunityQueryService`

Defined in: [src/community/services/community/community-query.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-query.service.ts#L12)

#### Parameters

##### communityRepository

`Repository`\<[`Community`](../../../../entities/community/community.entity/classes/Community.md)\>

#### Returns

`CommunityQueryService`

## Methods

### findAll()

> **findAll**(`query?`): `Promise`\<\{ `data`: [`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

Defined in: [src/community/services/community/community-query.service.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-query.service.ts#L20)

Get paginated + filtered list of communities

#### Parameters

##### query?

[`CommunityQueryDto`](../../../../dto/community-query.dto/classes/CommunityQueryDto.md)

#### Returns

`Promise`\<\{ `data`: [`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

---

### findAllWithMembership()

> **findAllWithMembership**(`userId`, `query?`): `Promise`\<\{ `data`: [`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md) & `object`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

Defined in: [src/community/services/community/community-query.service.ts:92](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-query.service.ts#L92)

Get paginated + filtered list of communities
with `isJoined` for an authenticated user

#### Parameters

##### userId

`string`

##### query?

[`CommunityQueryDto`](../../../../dto/community-query.dto/classes/CommunityQueryDto.md)

#### Returns

`Promise`\<\{ `data`: [`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md) & `object`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

---

### findOne()

> **findOne**(`id`): `Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

Defined in: [src/community/services/community/community-query.service.ts:177](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-query.service.ts#L177)

Get detailed community data by ID

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>
