[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [mood-log/mood-log.controller](../README.md) / MoodLogController

# Class: MoodLogController

Defined in: [src/mood-log/mood-log.controller.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/mood-log.controller.ts#L31)

## Constructors

### Constructor

> **new MoodLogController**(`moodLogService`): `MoodLogController`

Defined in: [src/mood-log/mood-log.controller.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/mood-log.controller.ts#L32)

#### Parameters

##### moodLogService

[`MoodLogService`](../../services/mood-log.service/classes/MoodLogService.md)

#### Returns

`MoodLogController`

## Methods

### create()

> **create**(`files`, `body`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\> \| [`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`MoodLog`](../../entities/mood-log.entity/classes/MoodLog.md)\>\>

Defined in: [src/mood-log/mood-log.controller.ts:49](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/mood-log.controller.ts#L49)

#### Parameters

##### files

###### photo?

`File`[]

###### voice?

`File`[]

##### body

[`CreateMoodLogDto`](../../dto/create-mood-log.dto/classes/CreateMoodLogDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\> \| [`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`MoodLog`](../../entities/mood-log.entity/classes/MoodLog.md)\>\>

---

### getHistory()

> **getHistory**(`req`, `limit`, `page`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`MoodLog`](../../entities/mood-log.entity/classes/MoodLog.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}\>\>

Defined in: [src/mood-log/mood-log.controller.ts:91](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/mood-log.controller.ts#L91)

#### Parameters

##### req

`any`

##### limit

`number` = `30`

##### page

`number` = `1`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`MoodLog`](../../entities/mood-log.entity/classes/MoodLog.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}\>\>

---

### getToday()

> **getToday**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/mood-log/mood-log.controller.ts:71](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/mood-log.controller.ts#L71)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>
