[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [common/dto/result.dto](../README.md) / ResultDto

# Class: ResultDto\<T\>

Defined in: [src/common/dto/result.dto.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L9)

Generic Result Data Transfer Object (DTO)
Used to standardize API responses across the application.
Supports both success and failure responses.

## Extended by

- [`CheckInResponseDto`](../../../../attendance/dto/check-in-response.dto/classes/CheckInResponseDto.md)
- [`CreateAttendanceResponseDto`](../../../../attendance/dto/create-attendance-response.dto/classes/CreateAttendanceResponseDto.md)
- [`LoginResponseDto`](../../../../auth/dto/login-response.dto/classes/LoginResponseDto.md)
- [`SignUpResponseDto`](../../../../auth/dto/signup-response.dto/classes/SignUpResponseDto.md)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new ResultDto**\<`T`\>(`partial`): `ResultDto`\<`T`\>

Defined in: [src/common/dto/result.dto.ts:28](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L28)

#### Parameters

##### partial

`Partial`\<`ResultDto`\<`T`\>\>

#### Returns

`ResultDto`\<`T`\>

## Properties

### data?

> `optional` **data**: `T`

Defined in: [src/common/dto/result.dto.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L23)

---

### errorType?

> `optional` **errorType**: `string`

Defined in: [src/common/dto/result.dto.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L26)

---

### message?

> `optional` **message**: `string`

Defined in: [src/common/dto/result.dto.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L17)

---

### reason?

> `optional` **reason**: `string`

Defined in: [src/common/dto/result.dto.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L20)

---

### statusCode

> **statusCode**: `number`

Defined in: [src/common/dto/result.dto.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L14)

---

### success

> **success**: `boolean`

Defined in: [src/common/dto/result.dto.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L11)

## Methods

### fail()

> `static` **fail**\<`T`\>(`reason`, `statusCode`, `errorType?`): `ResultDto`\<`T`\>

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

`ResultDto`\<`T`\>

---

### ok()

> `static` **ok**\<`T`\>(`data?`, `message?`, `statusCode?`): `ResultDto`\<`T`\>

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

`ResultDto`\<`T`\>

---

### okEmpty()

> `static` **okEmpty**(): `ResultDto`\<`void`\>

Defined in: [src/common/dto/result.dto.ts:100](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L100)

#### Returns

`ResultDto`\<`void`\>
