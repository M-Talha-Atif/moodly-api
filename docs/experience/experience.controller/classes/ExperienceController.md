[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [experience/experience.controller](../README.md) / ExperienceController

# Class: ExperienceController

Defined in: [src/experience/experience.controller.ts:28](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L28)

## Constructors

### Constructor

> **new ExperienceController**(`experienceService`, `userService`): `ExperienceController`

Defined in: [src/experience/experience.controller.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L29)

#### Parameters

##### experienceService

[`ExperienceService`](../../experience.service/classes/ExperienceService.md)

##### userService

[`UsersService`](../../../users/users.service/classes/UsersService.md)

#### Returns

`ExperienceController`

## Methods

### create()

> **create**(`dto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/experience/experience.controller.ts:46](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L46)

#### Parameters

##### dto

[`CreateExperienceDto`](../../dto/create-experience.dto/classes/CreateExperienceDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

---

### delete()

> **delete**(`id`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/experience/experience.controller.ts:93](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L93)

#### Parameters

##### id

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

---

### findAllForUser()

> **findAllForUser**(`req`, `page`, `limit`, `cultureTags`, `time`, `search`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`ExperienceListItemDto`](../../dto/experience-list-item.dto/classes/ExperienceListItemDto.md)[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>\>

Defined in: [src/experience/experience.controller.ts:168](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L168)

#### Parameters

##### req

`any`

##### page

`string` = `'1'`

##### limit

`string` = `'10'`

##### cultureTags

`string` | `string`[]

##### time

`string`

##### search

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`ExperienceListItemDto`](../../dto/experience-list-item.dto/classes/ExperienceListItemDto.md)[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>\>

---

### findAllPublic()

> **findAllPublic**(`page`, `limit`, `cultureTags`, `time`, `search`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`ExperienceListItemDto`](../../dto/experience-list-item.dto/classes/ExperienceListItemDto.md)[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>\>

Defined in: [src/experience/experience.controller.ts:116](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L116)

#### Parameters

##### page

`string` = `'1'`

##### limit

`string` = `'10'`

##### cultureTags

`string` | `string`[]

##### time

`string`

##### search

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`ExperienceListItemDto`](../../dto/experience-list-item.dto/classes/ExperienceListItemDto.md)[]; `meta`: \{ `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}; \}\>\>

---

### findOne()

> **findOne**(`req`, `experienceId`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/experience/experience.controller.ts:215](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L215)

#### Parameters

##### req

`any`

##### experienceId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

---

### update()

> **update**(`id`, `dto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/experience/experience.controller.ts:69](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/experience/experience.controller.ts#L69)

#### Parameters

##### id

`string`

##### dto

[`UpdateExperienceDto`](../../dto/update-experience.dto/classes/UpdateExperienceDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>
