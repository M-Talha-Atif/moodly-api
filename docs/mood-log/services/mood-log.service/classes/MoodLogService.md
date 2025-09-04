[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [mood-log/services/mood-log.service](../README.md) / MoodLogService

# Class: MoodLogService

Defined in: [src/mood-log/services/mood-log.service.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/mood-log.service.ts#L20)

## Constructors

### Constructor

> **new MoodLogService**(`moodLogRepo`, `rmqClient`, `validationService`, `storageService`): `MoodLogService`

Defined in: [src/mood-log/services/mood-log.service.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/mood-log.service.ts#L23)

#### Parameters

##### moodLogRepo

`Repository`\<[`MoodLog`](../../../entities/mood-log.entity/classes/MoodLog.md)\>

##### rmqClient

`ClientProxy`

##### validationService

[`ValidationService`](../../validation.service/classes/ValidationService.md)

##### storageService

[`StorageService`](../../storage.service/classes/StorageService.md)

#### Returns

`MoodLogService`

## Methods

### createForUser()

> **createForUser**(`userId`, `dto`, `files?`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\> \| [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`MoodLog`](../../../entities/mood-log.entity/classes/MoodLog.md)\>\>

Defined in: [src/mood-log/services/mood-log.service.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/mood-log.service.ts#L32)

#### Parameters

##### userId

`string`

##### dto

[`CreateMoodLogDto`](../../../dto/create-mood-log.dto/classes/CreateMoodLogDto.md)

##### files?

###### photo?

`File`

###### voice?

`File`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\> \| [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`MoodLog`](../../../entities/mood-log.entity/classes/MoodLog.md)\>\>

***

### getHistoryForUser()

> **getHistoryForUser**(`userId`, `limit`, `page`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`MoodLog`](../../../entities/mood-log.entity/classes/MoodLog.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}\>\>

Defined in: [src/mood-log/services/mood-log.service.ts:116](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/mood-log.service.ts#L116)

#### Parameters

##### userId

`string`

##### limit

`number` = `30`

##### page

`number` = `1`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `data`: [`MoodLog`](../../../entities/mood-log.entity/classes/MoodLog.md)[]; `limit`: `number`; `page`: `number`; `total`: `number`; `totalPages`: `number`; \}\>\>

***

### getTodayLogForUser()

> **getTodayLogForUser**(`userId`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/mood-log/services/mood-log.service.ts:95](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/mood-log.service.ts#L95)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>
