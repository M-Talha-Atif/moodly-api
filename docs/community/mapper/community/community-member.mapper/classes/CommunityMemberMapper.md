[**ai-moodler-backend v0.0.1**](../../../../../README.md)

---

[ai-moodler-backend](../../../../../README.md) / [community/mapper/community/community-member.mapper](../README.md) / CommunityMemberMapper

# Class: CommunityMemberMapper

Defined in: [src/community/mapper/community/community-member.mapper.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community-member.mapper.ts#L6)

## Constructors

### Constructor

> **new CommunityMemberMapper**(): `CommunityMemberMapper`

#### Returns

`CommunityMemberMapper`

## Methods

### toDto()

> `static` **toDto**(`entity`): [`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)

Defined in: [src/community/mapper/community/community-member.mapper.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community-member.mapper.ts#L11)

Maps a CommunityMember entity to DTO
Returns undefined if the entity is null/undefined

#### Parameters

##### entity

[`CommunityMember`](../../../../entities/community/community-member.entity/classes/CommunityMember.md)

#### Returns

[`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)

---

### toDtos()

> `static` **toDtos**(`entities`): [`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)[]

Defined in: [src/community/mapper/community/community-member.mapper.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/community/community-member.mapper.ts#L24)

Maps an array of CommunityMember entities to DTOs

#### Parameters

##### entities

[`CommunityMember`](../../../../entities/community/community-member.entity/classes/CommunityMember.md)[]

#### Returns

[`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)[]
