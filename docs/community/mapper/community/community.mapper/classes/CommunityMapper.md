[**ai-moodler-backend v0.0.1**](../../../../../README.md)

***

[ai-moodler-backend](../../../../../README.md) / [community/mapper/community/community.mapper](../README.md) / CommunityMapper

# Class: CommunityMapper

Defined in: [src/community/mapper/community/community.mapper.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community.mapper.ts#L9)

## Constructors

### Constructor

> **new CommunityMapper**(): `CommunityMapper`

#### Returns

`CommunityMapper`

## Methods

### applyUpdateDto()

> `static` **applyUpdateDto**(`entity`, `dto`): [`Community`](../../../../entities/community/community.entity/classes/Community.md)

Defined in: [src/community/mapper/community/community.mapper.ts:56](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community.mapper.ts#L56)

#### Parameters

##### entity

[`Community`](../../../../entities/community/community.entity/classes/Community.md)

##### dto

[`UpdateCommunityDto`](../../../../dto/update-community.dto/classes/UpdateCommunityDto.md)

#### Returns

[`Community`](../../../../entities/community/community.entity/classes/Community.md)

***

### fromCreateDto()

> `static` **fromCreateDto**(`dto`, `ownerId`): [`Community`](../../../../entities/community/community.entity/classes/Community.md)

Defined in: [src/community/mapper/community/community.mapper.ts:41](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community.mapper.ts#L41)

#### Parameters

##### dto

[`CreateCommunityDto`](../../../../dto/create-community.dto/classes/CreateCommunityDto.md)

##### ownerId

`string`

#### Returns

[`Community`](../../../../entities/community/community.entity/classes/Community.md)

***

### toListItemDto()

> `static` **toListItemDto**(`entity`): [`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)

Defined in: [src/community/mapper/community/community.mapper.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community.mapper.ts#L10)

#### Parameters

##### entity

[`Community`](../../../../entities/community/community.entity/classes/Community.md)

#### Returns

[`CommunityListItemDto`](../../../../dto/community-list-item.dto/classes/CommunityListItemDto.md)

***

### toResponseDto()

> `static` **toResponseDto**(`entity`): [`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)

Defined in: [src/community/mapper/community/community.mapper.ts:21](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community.mapper.ts#L21)

#### Parameters

##### entity

[`Community`](../../../../entities/community/community.entity/classes/Community.md)

#### Returns

[`CommunityResponseDto`](../../../../dto/community-response.dto/classes/CommunityResponseDto.md)
