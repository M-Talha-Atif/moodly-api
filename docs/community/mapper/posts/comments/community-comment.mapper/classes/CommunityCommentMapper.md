[**ai-moodler-backend v0.0.1**](../../../../../../README.md)

***

[ai-moodler-backend](../../../../../../README.md) / [community/mapper/posts/comments/community-comment.mapper](../README.md) / CommunityCommentMapper

# Class: CommunityCommentMapper

Defined in: [src/community/mapper/posts/comments/community-comment.mapper.ts:5](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/comments/community-comment.mapper.ts#L5)

## Constructors

### Constructor

> **new CommunityCommentMapper**(): `CommunityCommentMapper`

#### Returns

`CommunityCommentMapper`

## Methods

### toDto()

> `static` **toDto**(`comment`): [`CommunityCommentDto`](../../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)

Defined in: [src/community/mapper/posts/comments/community-comment.mapper.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/comments/community-comment.mapper.ts#L9)

Map a single comment entity to DTO

#### Parameters

##### comment

[`CommunityComment`](../../../../../entities/posts/comments/community-comment.entity/classes/CommunityComment.md)

#### Returns

[`CommunityCommentDto`](../../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)

***

### toDtos()

> `static` **toDtos**(`comments`): [`CommunityCommentDto`](../../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]

Defined in: [src/community/mapper/posts/comments/community-comment.mapper.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/mapper/posts/comments/community-comment.mapper.ts#L24)

Map an array of comment entities to DTOs

#### Parameters

##### comments

[`CommunityComment`](../../../../../entities/posts/comments/community-comment.entity/classes/CommunityComment.md)[]

#### Returns

[`CommunityCommentDto`](../../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]
