[**ai-moodler-backend v0.0.1**](../../../../../../README.md)

---

[ai-moodler-backend](../../../../../../README.md) / [community/services/posts/reactions/community-reaction.service](../README.md) / CommunityReactionService

# Class: CommunityReactionService

Defined in: [src/community/services/posts/reactions/community-reaction.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/reactions/community-reaction.service.ts#L13)

## Constructors

### Constructor

> **new CommunityReactionService**(`reactionRepo`, `userRepo`, `postRepo`, `transactionService`): `CommunityReactionService`

Defined in: [src/community/services/posts/reactions/community-reaction.service.ts:16](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/reactions/community-reaction.service.ts#L16)

#### Parameters

##### reactionRepo

`Repository`\<[`CommunityReaction`](../../../../../entities/posts/reactions/community-reaction.entity/classes/CommunityReaction.md)\>

##### userRepo

`Repository`\<[`User`](../../../../../../users/entities/user.entity/classes/User.md)\>

##### postRepo

`Repository`\<[`CommunityPost`](../../../../../entities/posts/community-post.entity/classes/CommunityPost.md)\>

##### transactionService

[`TransactionService`](../../../../../../common/services/transaction.service/classes/TransactionService.md)

#### Returns

`CommunityReactionService`

## Methods

### listReactions()

> **listReactions**(`postId`, `userId?`): `Promise`\<\{ `summary`: `Record`\<`string`, `number`\>; `userReaction`: `null` \| `string`; \}\>

Defined in: [src/community/services/posts/reactions/community-reaction.service.ts:77](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/reactions/community-reaction.service.ts#L77)

#### Parameters

##### postId

`string`

##### userId?

`string`

#### Returns

`Promise`\<\{ `summary`: `Record`\<`string`, `number`\>; `userReaction`: `null` \| `string`; \}\>

---

### removeReaction()

> **removeReaction**(`userId`, `postId`): `Promise`\<`boolean`\>

Defined in: [src/community/services/posts/reactions/community-reaction.service.ts:66](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/reactions/community-reaction.service.ts#L66)

Remove a reaction (regardless of type)

#### Parameters

##### userId

`string`

##### postId

`string`

#### Returns

`Promise`\<`boolean`\>

---

### upsertReaction()

> **upsertReaction**(`userId`, `postId`, `type`): `Promise`\<`null` \| [`CommunityReactionDto`](../../../../../dto/posts/reactions/community-reaction.dto/classes/CommunityReactionDto.md)\>

Defined in: [src/community/services/posts/reactions/community-reaction.service.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/posts/reactions/community-reaction.service.ts#L29)

Add or update reaction (idempotent)

#### Parameters

##### userId

`string`

##### postId

`string`

##### type

`string`

#### Returns

`Promise`\<`null` \| [`CommunityReactionDto`](../../../../../dto/posts/reactions/community-reaction.dto/classes/CommunityReactionDto.md)\>
