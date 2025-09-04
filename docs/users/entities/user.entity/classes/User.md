[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [users/entities/user.entity](../README.md) / User

# Class: User

Defined in: [src/users/entities/user.entity.ts:27](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L27)

## Constructors

### Constructor

> **new User**(): `User`

#### Returns

`User`

## Properties

### accountStatus

> **accountStatus**: [`AccountStatus`](../../../../common/enums/user.enums/enumerations/AccountStatus.md)

Defined in: [src/users/entities/user.entity.ts:88](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L88)

***

### avatarUrl

> **avatarUrl**: `string`

Defined in: [src/users/entities/user.entity.ts:44](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L44)

***

### bookings

> **bookings**: [`Booking`](../../../../booking/entities/booking.entity/classes/Booking.md)[]

Defined in: [src/users/entities/user.entity.ts:66](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L66)

***

### comments

> **comments**: [`CommunityComment`](../../../../community/entities/posts/comments/community-comment.entity/classes/CommunityComment.md)[]

Defined in: [src/users/entities/user.entity.ts:79](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L79)

***

### communicationStyle

> **communicationStyle**: `string`

Defined in: [src/users/entities/user.entity.ts:57](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L57)

***

### communityMemberships

> **communityMemberships**: [`CommunityMember`](../../../../community/entities/community/community-member.entity/classes/CommunityMember.md)[]

Defined in: [src/users/entities/user.entity.ts:85](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L85)

***

### createdAt

> **createdAt**: `Date`

Defined in: [src/users/entities/user.entity.ts:91](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L91)

***

### culturalBackground

> **culturalBackground**: `object`

Defined in: [src/users/entities/user.entity.ts:47](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L47)

#### ethnicity?

> `optional` **ethnicity**: `string`

#### religion?

> `optional` **religion**: `string`

#### values?

> `optional` **values**: `string`[]

***

### email

> **email**: `string`

Defined in: [src/users/entities/user.entity.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L32)

***

### experiences

> **experiences**: [`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)[]

Defined in: [src/users/entities/user.entity.ts:63](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L63)

***

### feedbacks

> **feedbacks**: [`Feedback`](../../../../feedback/entities/feedback.entity/classes/Feedback.md)[]

Defined in: [src/users/entities/user.entity.ts:69](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L69)

***

### id

> **id**: `string`

Defined in: [src/users/entities/user.entity.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L29)

***

### languagePreferences

> **languagePreferences**: `string`[]

Defined in: [src/users/entities/user.entity.ts:54](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L54)

***

### name

> **name**: `string`

Defined in: [src/users/entities/user.entity.ts:38](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L38)

***

### ownedCommunities

> **ownedCommunities**: [`Community`](../../../../community/entities/community/community.entity/classes/Community.md)[]

Defined in: [src/users/entities/user.entity.ts:73](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L73)

***

### passwordHash?

> `optional` **passwordHash**: `string`

Defined in: [src/users/entities/user.entity.ts:35](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L35)

***

### posts

> **posts**: [`CommunityPost`](../../../../community/entities/posts/community-post.entity/classes/CommunityPost.md)[]

Defined in: [src/users/entities/user.entity.ts:76](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L76)

***

### privacySettings

> **privacySettings**: [`PrivacySettings`](../../privacy.entity/classes/PrivacySettings.md)

Defined in: [src/users/entities/user.entity.ts:98](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L98)

***

### provider

> **provider**: [`AuthProvider`](../../../../common/enums/user.enums/enumerations/AuthProvider.md)

Defined in: [src/users/entities/user.entity.ts:41](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L41)

***

### reactions

> **reactions**: [`CommunityReaction`](../../../../community/entities/posts/reactions/community-reaction.entity/classes/CommunityReaction.md)[]

Defined in: [src/users/entities/user.entity.ts:82](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L82)

***

### role

> **role**: [`UserRole`](../../../../common/enums/user.enums/enumerations/UserRole.md)

Defined in: [src/users/entities/user.entity.ts:60](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L60)

***

### updatedAt

> **updatedAt**: `Date`

Defined in: [src/users/entities/user.entity.ts:94](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/entities/user.entity.ts#L94)
