[**ai-moodler-backend v0.0.1**](../../../../../README.md)

***

[ai-moodler-backend](../../../../../README.md) / [community/services/community/community.service](../README.md) / CommunityService

# Class: CommunityService

Defined in: [src/community/services/community/community.service.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L17)

## Constructors

### Constructor

> **new CommunityService**(`communityRepository`, `communityClient`): `CommunityService`

Defined in: [src/community/services/community/community.service.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L18)

#### Parameters

##### communityRepository

`Repository`\<[`Community`](../../../../entities/community/community.entity/classes/Community.md)\>

##### communityClient

`ClientProxy`

#### Returns

`CommunityService`

## Methods

### create()

> **create**(`dto`, `ownerId`): `Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

Defined in: [src/community/services/community/community.service.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L25)

#### Parameters

##### dto

[`CreateCommunityDto`](../../../../dto/create-community.dto/classes/CreateCommunityDto.md)

##### ownerId

`string`

#### Returns

`Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

***

### findAll()

> **findAll**(): `Promise`\<[`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]\>

Defined in: [src/community/services/community/community.service.ts:57](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L57)

#### Returns

`Promise`\<[`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

Defined in: [src/community/services/community/community.service.ts:43](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L43)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

***

### removeWithOwnerCheck()

> **removeWithOwnerCheck**(`id`, `ownerId`): `Promise`\<`void`\>

Defined in: [src/community/services/community/community.service.ts:112](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L112)

Remove with ownership check (controller expects this)

#### Parameters

##### id

`string`

##### ownerId

`string`

#### Returns

`Promise`\<`void`\>

***

### update()

> **update**(`id`, `dto`): `Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

Defined in: [src/community/services/community/community.service.ts:71](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L71)

#### Parameters

##### id

`string`

##### dto

[`UpdateCommunityDto`](../../../../dto/update-community.dto/classes/UpdateCommunityDto.md)

#### Returns

`Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

***

### updateWithOwnerCheck()

> **updateWithOwnerCheck**(`id`, `dto`, `ownerId`): `Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>

Defined in: [src/community/services/community/community.service.ts:88](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community.service.ts#L88)

Update with ownership check (controller expects this)

#### Parameters

##### id

`string`

##### dto

[`UpdateCommunityDto`](../../../../dto/update-community.dto/classes/UpdateCommunityDto.md)

##### ownerId

`string`

#### Returns

`Promise`\<[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)\>
