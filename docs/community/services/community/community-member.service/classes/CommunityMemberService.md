[**ai-moodler-backend v0.0.1**](../../../../../README.md)

***

[ai-moodler-backend](../../../../../README.md) / [community/services/community/community-member.service](../README.md) / CommunityMemberService

# Class: CommunityMemberService

Defined in: [src/community/services/community/community-member.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-member.service.ts#L12)

## Constructors

### Constructor

> **new CommunityMemberService**(`memberRepo`, `userRepo`, `communityRepo`, `transactionService`): `CommunityMemberService`

Defined in: [src/community/services/community/community-member.service.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-member.service.ts#L15)

#### Parameters

##### memberRepo

`Repository`\<[`CommunityMember`](../../../../entities/community/community-member.entity/classes/CommunityMember.md)\>

##### userRepo

`Repository`\<[`User`](../../../../../users/entities/user.entity/classes/User.md)\>

##### communityRepo

`Repository`\<[`Community`](../../../../entities/community/community.entity/classes/Community.md)\>

##### transactionService

[`TransactionService`](../../../../../common/services/transaction.service/classes/TransactionService.md)

#### Returns

`CommunityMemberService`

## Methods

### joinCommunity()

> **joinCommunity**(`userId`, `communityId`): `Promise`\<`null` \| [`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)\>

Defined in: [src/community/services/community/community-member.service.ts:30](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-member.service.ts#L30)

User joins a community (transactional)
- Wrapped in a transaction to prevent race conditions when two requests try to join the same user at the same time
- Logs each step for monitoring

#### Parameters

##### userId

`string`

##### communityId

`string`

#### Returns

`Promise`\<`null` \| [`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)\>

***

### leaveCommunity()

> **leaveCommunity**(`userId`, `communityId`): `Promise`\<`boolean`\>

Defined in: [src/community/services/community/community-member.service.ts:79](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-member.service.ts#L79)

User leaves a community (transactional)
- Ensures atomic deletion
- Logs every step

#### Parameters

##### userId

`string`

##### communityId

`string`

#### Returns

`Promise`\<`boolean`\>

***

### listMembers()

> **listMembers**(`communityId`, `page`, `limit`): `Promise`\<[`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)[]\>

Defined in: [src/community/services/community/community-member.service.ts:116](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/community/services/community/community-member.service.ts#L116)

List all members of a community

Previous implementation issues:
- Used `find` with eager-loaded relations, which can trigger N+1 queries if users have nested relations
- No pagination: could load thousands of members at once

Improvements:
1. Uses QueryBuilder with JOIN to fetch all required data in a single query (avoids N+1 problem)
2. Supports pagination to prevent memory issues on large communities
3. Orders by joinedAt to provide consistent results

#### Parameters

##### communityId

`string`

##### page

`number` = `1`

##### limit

`number` = `50`

#### Returns

`Promise`\<[`CommunityMemberDto`](../../../../dto/community-member.dto/classes/CommunityMemberDto.md)[]\>
