[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [mood-log/services/emotion-analysis.service](../README.md) / EmotionAnalysisService

# Class: EmotionAnalysisService

Defined in: [src/mood-log/services/emotion-analysis.service.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/emotion-analysis.service.ts#L14)

Service for detecting emotions from media files (images/audio)

## Constructors

### Constructor

> **new EmotionAnalysisService**(`configService`, `validationService`): `EmotionAnalysisService`

Defined in: [src/mood-log/services/emotion-analysis.service.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/emotion-analysis.service.ts#L17)

#### Parameters

##### configService

`ConfigService`

##### validationService

[`ValidationService`](../../validation.service/classes/ValidationService.md)

#### Returns

`EmotionAnalysisService`

## Methods

### analyzeImageEmotion()

> **analyzeImageEmotion**(`filePath`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`EmotionApiResponse`](../../../interfaces/emotion-api-response-interface/interfaces/EmotionApiResponse.md)\>\>

Defined in: [src/mood-log/services/emotion-analysis.service.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/emotion-analysis.service.ts#L25)

Analyzes an image file for emotional content

#### Parameters

##### filePath

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`EmotionApiResponse`](../../../interfaces/emotion-api-response-interface/interfaces/EmotionApiResponse.md)\>\>

***

### analyzeVoiceEmotion()

> **analyzeVoiceEmotion**(`filePath`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`EmotionApiResponse`](../../../interfaces/emotion-api-response-interface/interfaces/EmotionApiResponse.md)\>\>

Defined in: [src/mood-log/services/emotion-analysis.service.ts:34](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/emotion-analysis.service.ts#L34)

Analyzes a voice recording for emotional content

#### Parameters

##### filePath

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`EmotionApiResponse`](../../../interfaces/emotion-api-response-interface/interfaces/EmotionApiResponse.md)\>\>
