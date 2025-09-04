[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [community/community.controller](../README.md) / CommunityController

# Class: CommunityController

Defined in: [src/community/community.controller.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L31)

## Constructors

### Constructor

> **new CommunityController**(`communityService`, `communityQueryService`, `communityMemberService`, `communityPostService`, `communityReactionService`, `communityCommentService`): `CommunityController`

Defined in: [src/community/community.controller.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L32)

#### Parameters

##### communityService

[`CommunityService`](../../services/community/community.service/classes/CommunityService.md)

##### communityQueryService

[`CommunityQueryService`](../../services/community/community-query.service/classes/CommunityQueryService.md)

##### communityMemberService

[`CommunityMemberService`](../../services/community/community-member.service/classes/CommunityMemberService.md)

##### communityPostService

[`CommunityPostService`](../../services/posts/community-post.service/classes/CommunityPostService.md)

##### communityReactionService

[`CommunityReactionService`](../../services/posts/reactions/community-reaction.service/classes/CommunityReactionService.md)

##### communityCommentService

[`CommunityCommentService`](../../services/comments/community-comment.service/classes/CommunityCommentService.md)

#### Returns

`CommunityController`

## Methods

### addComment()

> **addComment**(`postId`, `content`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:287](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L287)

Add a comment to a post

#### Parameters

##### postId

`string`

##### content

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### create()

> **create**(`dto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

Defined in: [src/community/community.controller.ts:51](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L51)

Host creates a new community

#### Parameters

##### dto

[`CreateCommunityDto`](../../dto/create-community.dto/classes/CreateCommunityDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

***

### createPost()

> **createPost**(`communityId`, `body`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:176](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L176)

#### Parameters

##### communityId

`string`

##### body

###### content

`string`

###### mediaUrl?

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### deleteComment()

> **deleteComment**(`commentId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:332](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L332)

Delete a comment by ID (author only)

#### Parameters

##### commentId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### deletePost()

> **deletePost**(`postId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:222](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L222)

#### Parameters

##### postId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### findAll()

> **findAll**(`query`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`CommunityListItemDto`](../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>\>

Defined in: [src/community/community.controller.ts:102](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L102)

Public endpoint: list all communities

#### Parameters

##### query

[`CommunityQueryDto`](../../dto/community-query.dto/classes/CommunityQueryDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`CommunityListItemDto`](../../dto/community-list-item.dto/classes/CommunityListItemDto.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>\>

***

### findAllWithMembership()

> **findAllWithMembership**(`query`, `req`): `Promise`\<\{ `data`: [`CommunityListItemDto`](../../dto/community-list-item.dto/classes/CommunityListItemDto.md) & `object`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

Defined in: [src/community/community.controller.ts:164](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L164)

Authenticated: Get communities with `isJoined`

#### Parameters

##### query

[`CommunityQueryDto`](../../dto/community-query.dto/classes/CommunityQueryDto.md)

##### req

`any`

#### Returns

`Promise`\<\{ `data`: [`CommunityListItemDto`](../../dto/community-list-item.dto/classes/CommunityListItemDto.md) & `object`[]; `limit`: `number`; `page`: `number`; `total`: `number`; \}\>

***

### findOne()

> **findOne**(`id`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

Defined in: [src/community/community.controller.ts:113](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L113)

Public endpoint: get details of a single community

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

***

### getPost()

> **getPost**(`postId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:210](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L210)

#### Parameters

##### postId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### join()

> **join**(`communityId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:122](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L122)

#### Parameters

##### communityId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### leave()

> **leave**(`communityId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:141](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L141)

#### Parameters

##### communityId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### listComments()

> **listComments**(`postId`, `cursor?`, `limit?`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`CommunityCommentDto`](../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]; `nextCursor`: `null` \| `string`; \}\>\>

Defined in: [src/community/community.controller.ts:308](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L308)

List all comments for a post

#### Parameters

##### postId

`string`

##### cursor?

`string`

##### limit?

`number` = `10`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`CommunityCommentDto`](../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]; `nextCursor`: `null` \| `string`; \}\>\>

***

### listMembers()

> **listMembers**(`communityId`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityMemberDto`](../../dto/community-member.dto/classes/CommunityMemberDto.md)[]\>\>

Defined in: [src/community/community.controller.ts:154](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L154)

#### Parameters

##### communityId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityMemberDto`](../../dto/community-member.dto/classes/CommunityMemberDto.md)[]\>\>

***

### listPosts()

> **listPosts**(`communityId`, `page`, `limit`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityPostDto`](../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]\>\>

Defined in: [src/community/community.controller.ts:193](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L193)

#### Parameters

##### communityId

`string`

##### page

`number` = `1`

##### limit

`number` = `20`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityPostDto`](../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]\>\>

***

### listReactions()

> **listReactions**(`postId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `summary`: `Record`\<`string`, `number`\>; `userReaction`: `null` \| `string`; \}\>\>

Defined in: [src/community/community.controller.ts:270](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L270)

#### Parameters

##### postId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `summary`: `Record`\<`string`, `number`\>; `userReaction`: `null` \| `string`; \}\>\>

***

### remove()

> **remove**(`id`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>\>

Defined in: [src/community/community.controller.ts:84](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L84)

Host deletes their community

#### Parameters

##### id

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>\>

***

### removeReaction()

> **removeReaction**(`postId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:257](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L257)

#### Parameters

##### postId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

***

### update()

> **update**(`id`, `dto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

Defined in: [src/community/community.controller.ts:64](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L64)

Host updates their community

#### Parameters

##### id

`string`

##### dto

[`UpdateCommunityDto`](../../dto/update-community.dto/classes/UpdateCommunityDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`CommunityResponseDto`](../../dto/community-response.dto/classes/CommunityResponseDto.md)\>\>

***

### upsertReaction()

> **upsertReaction**(`postId`, `body`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/community/community.controller.ts:239](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/community.controller.ts#L239)

#### Parameters

##### postId

`string`

##### body

###### type

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>
