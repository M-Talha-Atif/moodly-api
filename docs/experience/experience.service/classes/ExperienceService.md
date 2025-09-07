[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [experience/experience.service](../README.md) / ExperienceService

# Class: ExperienceService

Defined in: [src/experience/experience.service.ts:21](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L21)

## Constructors

### Constructor

> **new ExperienceService**(`experienceRepo`, `embeddingService`, `experienceEmbeddingModel`): `ExperienceService`

Defined in: [src/experience/experience.service.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L22)

#### Parameters

##### experienceRepo

`Repository`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>

##### embeddingService

[`EmbeddingService`](../../../embedding/embedding.service/classes/EmbeddingService.md)

##### experienceEmbeddingModel

`Model`\<[`ExperienceEmbedding`](../../../embedding/schemas/experience-embedding.schema/classes/ExperienceEmbedding.md)\>

#### Returns

`ExperienceService`

## Methods

### create()

> **create**(`dto`, `host`): `Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>

Defined in: [src/experience/experience.service.ts:33](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L33)

#### Parameters

##### dto

[`CreateExperienceDto`](../../dto/create-experience.dto/classes/CreateExperienceDto.md)

##### host

[`User`](../../../users/entities/user.entity/classes/User.md)

#### Returns

`Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>

---

### findAllForUser()

> **findAllForUser**(`userId`, `page`, `limit`, `cultureTags?`, `timeFilter?`, `search?`): `Promise`\<\{ `data`: `any`[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>

Defined in: [src/experience/experience.service.ts:80](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L80)

#### Parameters

##### userId

`string`

##### page

`number` = `1`

##### limit

`number` = `10`

##### cultureTags?

`string`[]

##### timeFilter?

`string`

##### search?

`string`

#### Returns

`Promise`\<\{ `data`: `any`[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>

---

### findAllPublic()

> **findAllPublic**(`page`, `limit`, `cultureTags?`, `timeFilter?`, `search?`): `Promise`\<\[[`Experience`](../../entities/experience.entity/classes/Experience.md)[], `number`\]\>

Defined in: [src/experience/experience.service.ts:54](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L54)

#### Parameters

##### page

`number` = `1`

##### limit

`number` = `10`

##### cultureTags?

`string`[]

##### timeFilter?

`string`

##### search?

`string`

#### Returns

`Promise`\<\[[`Experience`](../../entities/experience.entity/classes/Experience.md)[], `number`\]\>

---

### findOne()

> **findOne**(`id`): `Promise`\<`null` \| [`Experience`](../../entities/experience.entity/classes/Experience.md)\>

Defined in: [src/experience/experience.service.ts:146](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L146)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`null` \| [`Experience`](../../entities/experience.entity/classes/Experience.md)\>

---

### findOneWithBooking()

> **findOneWithBooking**(`expId`, `userId`): `Promise`\<`null` \| \{ `aiPrep`: `any`; `bookingId`: `null`; `bookings`: [`Booking`](../../../booking/entities/booking.entity/classes/Booking.md)[]; `bookingStatus`: `null`; `cancellationPolicy`: `string`; `createdAt`: `Date`; `culturalTags`: `string`[]; `date`: `Date`; `description`: `string`; `desiredOutcomes`: `string`[]; `engagementStats`: `any`; `experienceOutcomeSummary`: `string`; `feedbacks`: [`Feedback`](../../../feedback/entities/feedback.entity/classes/Feedback.md)[]; `growthDimensions`: `any`; `host`: [`User`](../../../users/entities/user.entity/classes/User.md); `id`: `string`; `idealParticipantTraits`: `string`[]; `image`: `string`; `isBooked`: `boolean`; `isVirtual`: `boolean`; `language`: `string`; `location`: `string`; `meetingLink`: `string`; `preparation`: `any`; `price`: `number`; `sessionEndTime`: `Date`; `sessionStartTime`: `Date`; `spotsFilled`: `number`; `targetEmotions`: `string`[]; `testimonials`: `any`; `timezone`: `string`; `title`: `string`; `totalSpots`: `number`; `updatedAt`: `Date`; \} \| \{ `aiPrep`: `any`; `bookingId`: `null` \| `string`; `bookings`: [`Booking`](../../../booking/entities/booking.entity/classes/Booking.md)[]; `bookingStatus`: `"confirmed"` \| `"waitlisted"`; `cancellationPolicy`: `string`; `createdAt`: `Date`; `culturalTags`: `string`[]; `date`: `Date`; `description`: `string`; `desiredOutcomes`: `string`[]; `engagementStats`: `any`; `experienceOutcomeSummary`: `string`; `feedbacks`: [`Feedback`](../../../feedback/entities/feedback.entity/classes/Feedback.md)[]; `growthDimensions`: `any`; `host`: [`User`](../../../users/entities/user.entity/classes/User.md); `id`: `string`; `idealParticipantTraits`: `string`[]; `image`: `string`; `isBooked`: `boolean`; `isVirtual`: `boolean`; `language`: `string`; `location`: `string`; `meetingLink`: `string`; `preparation`: `any`; `price`: `number`; `sessionEndTime`: `Date`; `sessionStartTime`: `Date`; `spotsFilled`: `number`; `targetEmotions`: `string`[]; `testimonials`: `any`; `timezone`: `string`; `title`: `string`; `totalSpots`: `number`; `updatedAt`: `Date`; \}\>

Defined in: [src/experience/experience.service.ts:153](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L153)

#### Parameters

##### expId

`string`

##### userId

`string`

#### Returns

`Promise`\<`null` \| \{ `aiPrep`: `any`; `bookingId`: `null`; `bookings`: [`Booking`](../../../booking/entities/booking.entity/classes/Booking.md)[]; `bookingStatus`: `null`; `cancellationPolicy`: `string`; `createdAt`: `Date`; `culturalTags`: `string`[]; `date`: `Date`; `description`: `string`; `desiredOutcomes`: `string`[]; `engagementStats`: `any`; `experienceOutcomeSummary`: `string`; `feedbacks`: [`Feedback`](../../../feedback/entities/feedback.entity/classes/Feedback.md)[]; `growthDimensions`: `any`; `host`: [`User`](../../../users/entities/user.entity/classes/User.md); `id`: `string`; `idealParticipantTraits`: `string`[]; `image`: `string`; `isBooked`: `boolean`; `isVirtual`: `boolean`; `language`: `string`; `location`: `string`; `meetingLink`: `string`; `preparation`: `any`; `price`: `number`; `sessionEndTime`: `Date`; `sessionStartTime`: `Date`; `spotsFilled`: `number`; `targetEmotions`: `string`[]; `testimonials`: `any`; `timezone`: `string`; `title`: `string`; `totalSpots`: `number`; `updatedAt`: `Date`; \} \| \{ `aiPrep`: `any`; `bookingId`: `null` \| `string`; `bookings`: [`Booking`](../../../booking/entities/booking.entity/classes/Booking.md)[]; `bookingStatus`: `"confirmed"` \| `"waitlisted"`; `cancellationPolicy`: `string`; `createdAt`: `Date`; `culturalTags`: `string`[]; `date`: `Date`; `description`: `string`; `desiredOutcomes`: `string`[]; `engagementStats`: `any`; `experienceOutcomeSummary`: `string`; `feedbacks`: [`Feedback`](../../../feedback/entities/feedback.entity/classes/Feedback.md)[]; `growthDimensions`: `any`; `host`: [`User`](../../../users/entities/user.entity/classes/User.md); `id`: `string`; `idealParticipantTraits`: `string`[]; `image`: `string`; `isBooked`: `boolean`; `isVirtual`: `boolean`; `language`: `string`; `location`: `string`; `meetingLink`: `string`; `preparation`: `any`; `price`: `number`; `sessionEndTime`: `Date`; `sessionStartTime`: `Date`; `spotsFilled`: `number`; `targetEmotions`: `string`[]; `testimonials`: `any`; `timezone`: `string`; `title`: `string`; `totalSpots`: `number`; `updatedAt`: `Date`; \}\>

---

### remove()

> **remove**(`id`): `Promise`\<`void`\>

Defined in: [src/experience/experience.service.ts:214](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L214)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### update()

> **update**(`id`, `dto`): `Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>

Defined in: [src/experience/experience.service.ts:191](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.service.ts#L191)

#### Parameters

##### id

`string`

##### dto

[`UpdateExperienceDto`](../../dto/update-experience.dto/classes/UpdateExperienceDto.md)

#### Returns

`Promise`\<[`Experience`](../../entities/experience.entity/classes/Experience.md)\>
