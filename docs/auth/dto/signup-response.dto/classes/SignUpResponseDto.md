[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [auth/dto/signup-response.dto](../README.md) / SignUpResponseDto

# Class: SignUpResponseDto

Defined in: [src/auth/dto/signup-response.dto.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup-response.dto.ts#L9)

DTO representing the response after a successful user sign-up.

Extends the standardized ResultDto to include the created User entity.

## Extends

- [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`User`](../../../../users/entities/user.entity/classes/User.md)\>

## Constructors

### Constructor

> **new SignUpResponseDto**(`partial`): `SignUpResponseDto`

Defined in: [src/auth/dto/signup-response.dto.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup-response.dto.ts#L15)

Initializes the SignUpResponseDto with provided properties.

#### Parameters

##### partial

`Partial`\<`SignUpResponseDto`\>

Partial response data (success, message, data, etc.).

#### Returns

`SignUpResponseDto`

#### Overrides

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`constructor`](../../../../common/dto/result.dto/classes/ResultDto.md#constructor)

## Properties

### data?

> `optional` **data**: [`User`](../../../../users/entities/user.entity/classes/User.md)

Defined in: [src/common/dto/result.dto.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L23)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`data`](../../../../common/dto/result.dto/classes/ResultDto.md#data)

***

### errorType?

> `optional` **errorType**: `string`

Defined in: [src/common/dto/result.dto.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L26)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`errorType`](../../../../common/dto/result.dto/classes/ResultDto.md#errortype)

***

### message?

> `optional` **message**: `string`

Defined in: [src/common/dto/result.dto.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L17)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`message`](../../../../common/dto/result.dto/classes/ResultDto.md#message)

***

### reason?

> `optional` **reason**: `string`

Defined in: [src/common/dto/result.dto.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L20)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`reason`](../../../../common/dto/result.dto/classes/ResultDto.md#reason)

***

### statusCode

> **statusCode**: `number`

Defined in: [src/common/dto/result.dto.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L14)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`statusCode`](../../../../common/dto/result.dto/classes/ResultDto.md#statuscode)

***

### success

> **success**: `boolean`

Defined in: [src/common/dto/result.dto.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L11)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`success`](../../../../common/dto/result.dto/classes/ResultDto.md#success)

## Methods

### fail()

> `static` **fail**\<`T`\>(`reason`, `statusCode`, `errorType?`): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`T`\>

Defined in: [src/common/dto/result.dto.ts:81](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L81)

#### Type Parameters

##### T

`T`

#### Parameters

##### reason

`string`

##### statusCode

`number` = `400`

##### errorType?

`string`

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`T`\>

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`fail`](../../../../common/dto/result.dto/classes/ResultDto.md#fail)

***

### ok()

> `static` **ok**\<`T`\>(`data?`, `message?`, `statusCode?`): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`T`\>

Defined in: [src/common/dto/result.dto.ts:72](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L72)

#### Type Parameters

##### T

`T`

#### Parameters

##### data?

`T`

##### message?

`string`

##### statusCode?

`number` = `200`

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`T`\>

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`ok`](../../../../common/dto/result.dto/classes/ResultDto.md#ok)

***

### okEmpty()

> `static` **okEmpty**(): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

Defined in: [src/common/dto/result.dto.ts:100](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L100)

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`okEmpty`](../../../../common/dto/result.dto/classes/ResultDto.md#okempty)
