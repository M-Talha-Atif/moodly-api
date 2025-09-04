[**ai-moodler-backend v0.0.1**](../../../../../README.md)

***

[ai-moodler-backend](../../../../../README.md) / [community/mapper/posts/community-post.mapper](../README.md) / CommunityPostMapper

# Class: CommunityPostMapper

Defined in: [src/community/mapper/posts/community-post.mapper.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/community-post.mapper.ts#L6)

## Constructors

### Constructor

> **new CommunityPostMapper**(): `CommunityPostMapper`

#### Returns

`CommunityPostMapper`

## Methods

### toDto()

> `static` **toDto**(`entity`, `currentUserId?`): [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)

Defined in: [src/community/mapper/posts/community-post.mapper.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/community-post.mapper.ts#L10)

Map a single CommunityPost entity to DTO

#### Parameters

##### entity

[`CommunityPost`](../../../../entities/posts/community-post.entity/classes/CommunityPost.md)

##### currentUserId?

`string`

#### Returns

[`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)

***

### toDtos()

> `static` **toDtos**(`entities`, `currentUserId?`): [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]

Defined in: [src/community/mapper/posts/community-post.mapper.ts:52](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/community-post.mapper.ts#L52)

Map an array of CommunityPost entities to DTOs

#### Parameters

##### entities

[`CommunityPost`](../../../../entities/posts/community-post.entity/classes/CommunityPost.md)[]

##### currentUserId?

`string`

#### Returns

[`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]
