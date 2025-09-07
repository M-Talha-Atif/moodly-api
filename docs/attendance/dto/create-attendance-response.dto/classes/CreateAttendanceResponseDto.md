[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [attendance/dto/create-attendance-response.dto](../README.md) / CreateAttendanceResponseDto

# Class: CreateAttendanceResponseDto

Defined in: [src/attendance/dto/create-attendance-response.dto.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/create-attendance-response.dto.ts#L9)

DTO representing the response structure after creating a new attendance record.
Extends ResultDto to include both the created attendance entity and a generated token.

## Extends

- [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<\{ `attendance`: [`Attendance`](../../../entities/attendance.entity/classes/Attendance.md); `token`: `string`; \}\>

## Constructors

### Constructor

> **new CreateAttendanceResponseDto**(`partial`): `CreateAttendanceResponseDto`

Defined in: [src/attendance/dto/create-attendance-response.dto.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/create-attendance-response.dto.ts#L31)

Initializes the DTO using partial data.

#### Parameters

##### partial

`Partial`\<`CreateAttendanceResponseDto`\>

Partial properties to assign to the DTO.

#### Returns

`CreateAttendanceResponseDto`

#### Overrides

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`constructor`](../../../../common/dto/result.dto/classes/ResultDto.md#constructor)

## Properties

### attendance

> **attendance**: [`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)

Defined in: [src/attendance/dto/create-attendance-response.dto.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/create-attendance-response.dto.ts#L17)

The newly created attendance entity.

---

### data?

> `optional` **data**: `object`

Defined in: [src/common/dto/result.dto.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L23)

#### attendance

> **attendance**: [`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)

#### token

> **token**: `string`

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`data`](../../../../common/dto/result.dto/classes/ResultDto.md#data)

---

### errorType?

> `optional` **errorType**: `string`

Defined in: [src/common/dto/result.dto.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L26)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`errorType`](../../../../common/dto/result.dto/classes/ResultDto.md#errortype)

---

### message?

> `optional` **message**: `string`

Defined in: [src/common/dto/result.dto.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L17)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`message`](../../../../common/dto/result.dto/classes/ResultDto.md#message)

---

### reason?

> `optional` **reason**: `string`

Defined in: [src/common/dto/result.dto.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L20)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`reason`](../../../../common/dto/result.dto/classes/ResultDto.md#reason)

---

### statusCode

> **statusCode**: `number`

Defined in: [src/common/dto/result.dto.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L14)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`statusCode`](../../../../common/dto/result.dto/classes/ResultDto.md#statuscode)

---

### success

> **success**: `boolean`

Defined in: [src/common/dto/result.dto.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L11)

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`success`](../../../../common/dto/result.dto/classes/ResultDto.md#success)

---

### token

> **token**: `string`

Defined in: [src/attendance/dto/create-attendance-response.dto.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/create-attendance-response.dto.ts#L24)

A generated token (e.g., JWT or QR-based token) associated with the attendance.
Typically used for subsequent validation or quick check-ins.

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

---

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

---

### okEmpty()

> `static` **okEmpty**(): [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

Defined in: [src/common/dto/result.dto.ts:100](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L100)

#### Returns

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`void`\>

#### Inherited from

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`okEmpty`](../../../../common/dto/result.dto/classes/ResultDto.md#okempty)
