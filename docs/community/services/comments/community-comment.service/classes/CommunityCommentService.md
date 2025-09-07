[**ai-moodler-backend v0.0.1**](../../../../../README.md)

---

[ai-moodler-backend](../../../../../README.md) / [community/services/comments/community-comment.service](../README.md) / CommunityCommentService

# Class: CommunityCommentService

Defined in: [src/community/services/comments/community-comment.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/comments/community-comment.service.ts#L12)

## Constructors

### Constructor

> **new CommunityCommentService**(`commentRepo`, `postRepo`, `userRepo`, `transactionService`): `CommunityCommentService`

Defined in: [src/community/services/comments/community-comment.service.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/comments/community-comment.service.ts#L15)

#### Parameters

##### commentRepo

`Repository`\<[`CommunityComment`](../../../../entities/posts/comments/community-comment.entity/classes/CommunityComment.md)\>

##### postRepo

`Repository`\<[`CommunityPost`](../../../../entities/posts/community-post.entity/classes/CommunityPost.md)\>

##### userRepo

`Repository`\<[`User`](../../../../../users/entities/user.entity/classes/User.md)\>

##### transactionService

[`TransactionService`](../../../../../common/services/transaction.service/classes/TransactionService.md)

#### Returns

`CommunityCommentService`

## Methods

### addComment()

> **addComment**(`userId`, `postId`, `content`): `Promise`\<`null` \| [`CommunityCommentDto`](../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)\>

Defined in: [src/community/services/comments/community-comment.service.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/comments/community-comment.service.ts#L31)

Create a comment on a post

#### Parameters

##### userId

`string`

##### postId

`string`

##### content

`string`

#### Returns

`Promise`\<`null` \| [`CommunityCommentDto`](../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)\>

---

### deleteComment()

> **deleteComment**(`userId`, `commentId`): `Promise`\<`boolean`\>

Defined in: [src/community/services/comments/community-comment.service.ts:95](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/comments/community-comment.service.ts#L95)

Delete a comment (only author can delete)

#### Parameters

##### userId

`string`

##### commentId

`string`

#### Returns

`Promise`\<`boolean`\>

---

### listComments()

> **listComments**(`postId`, `cursor?`, `limit?`): `Promise`\<\{ `data`: [`CommunityCommentDto`](../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]; `nextCursor`: `null` \| `string`; \}\>

Defined in: [src/community/services/comments/community-comment.service.ts:64](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/comments/community-comment.service.ts#L64)

List all comments for a post

#### Parameters

##### postId

`string`

##### cursor?

`string`

##### limit?

`number` = `10`

#### Returns

`Promise`\<\{ `data`: [`CommunityCommentDto`](../../../../dto/posts/comments/community-comment.dto/classes/CommunityCommentDto.md)[]; `nextCursor`: `null` \| `string`; \}\>
