[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [mood-log/services/validation.service](../README.md) / ValidationService

# Class: ValidationService

Defined in: [src/mood-log/services/validation.service.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/validation.service.ts#L8)

## Constructors

### Constructor

> **new ValidationService**(): `ValidationService`

#### Returns

`ValidationService`

## Methods

### validateExistingVoiceFile()

> **validateExistingVoiceFile**(`filePath`): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

Defined in: [src/mood-log/services/validation.service.ts:66](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/validation.service.ts#L66)

Validates existing voice file path

#### Parameters

##### filePath

`string`

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

***

### validateInputs()

> **validateInputs**(`dto`, `files?`): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

Defined in: [src/mood-log/services/validation.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/validation.service.ts#L12)

Validates that at least one input type is provided

#### Parameters

##### dto

[`CreateMoodLogDto`](../../../dto/create-mood-log.dto/classes/CreateMoodLogDto.md)

##### files?

###### photo?

`File`

###### voice?

`File`

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

***

### validateVoiceFile()

> **validateVoiceFile**(`file`): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

Defined in: [src/mood-log/services/validation.service.ts:38](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/validation.service.ts#L38)

Validates voice file before saving

#### Parameters

##### file

`File`

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>
