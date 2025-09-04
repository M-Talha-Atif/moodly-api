[**ai-moodler-backend v0.0.1**](../../../../../README.md)

***

[ai-moodler-backend](../../../../../README.md) / [community/services/posts/community-post.service](../README.md) / CommunityPostService

# Class: CommunityPostService

Defined in: [src/community/services/posts/community-post.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L13)

## Constructors

### Constructor

> **new CommunityPostService**(`postRepo`, `userRepo`, `communityRepo`, `transactionService`): `CommunityPostService`

Defined in: [src/community/services/posts/community-post.service.ts:16](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L16)

#### Parameters

##### postRepo

`Repository`\<[`CommunityPost`](../../../../entities/posts/community-post.entity/classes/CommunityPost.md)\>

##### userRepo

`Repository`\<[`User`](../../../../../users/entities/user.entity/classes/User.md)\>

##### communityRepo

`Repository`\<[`Community`](../../../../entities/community/community.entity/classes/Community.md)\>

##### transactionService

[`TransactionService`](../../../../../common/services/transaction.service/classes/TransactionService.md)

#### Returns

`CommunityPostService`

## Methods

### createPost()

> **createPost**(`userId`, `communityId`, `content`, `mediaUrl?`): `Promise`\<`null` \| [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)\>

Defined in: [src/community/services/posts/community-post.service.ts:30](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L30)

Create a new post in a community
Wrapped in a transaction to ensure consistency

#### Parameters

##### userId

`string`

##### communityId

`string`

##### content

`string`

##### mediaUrl?

`string`

#### Returns

`Promise`\<`null` \| [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)\>

***

### deletePost()

> **deletePost**(`userId`, `postId`): `Promise`\<`boolean`\>

Defined in: [src/community/services/posts/community-post.service.ts:108](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L108)

Delete a post by its author

#### Parameters

##### userId

`string`

##### postId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### getPost()

> **getPost**(`postId`, `currentUserId?`): `Promise`\<`null` \| [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)\>

Defined in: [src/community/services/posts/community-post.service.ts:94](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L94)

Get a single post by ID

#### Parameters

##### postId

`string`

##### currentUserId?

`string`

#### Returns

`Promise`\<`null` \| [`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)\>

***

### listPosts()

> **listPosts**(`communityId`, `page`, `limit`, `currentUserId?`): `Promise`\<[`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]\>

Defined in: [src/community/services/posts/community-post.service.ts:68](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/community-post.service.ts#L68)

List posts in a community with pagination

#### Parameters

##### communityId

`string`

##### page

`number` = `1`

##### limit

`number` = `20`

##### currentUserId?

`string`

#### Returns

`Promise`\<[`CommunityPostDto`](../../../../dto/posts/community-post.dto/classes/CommunityPostDto.md)[]\>
