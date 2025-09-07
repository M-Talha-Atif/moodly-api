[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [attendance/dto/check-in-response.dto](../README.md) / CheckInResponseDto

# Class: CheckInResponseDto

Defined in: [src/attendance/dto/check-in-response.dto.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/check-in-response.dto.ts#L9)

DTO representing the response structure for check-in operations.
Extends the generic ResultDto to include additional attendance-specific data.

## Extends

- [`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)\>

## Constructors

### Constructor

> **new CheckInResponseDto**(`partial`): `CheckInResponseDto`

Defined in: [src/attendance/dto/check-in-response.dto.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/check-in-response.dto.ts#L23)

Initializes the DTO using partial data.
Useful for constructing flexible response objects.

#### Parameters

##### partial

`Partial`\<`CheckInResponseDto`\>

Partial properties to assign to the DTO.

#### Returns

`CheckInResponseDto`

#### Overrides

[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md).[`constructor`](../../../../common/dto/result.dto/classes/ResultDto.md#constructor)

## Properties

### attendance?

> `optional` **attendance**: [`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)

Defined in: [src/attendance/dto/check-in-response.dto.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/check-in-response.dto.ts#L15)

The attendance entity returned upon a successful check-in.
This property is optional and only present in case of success.

---

### data?

> `optional` **data**: [`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)

Defined in: [src/common/dto/result.dto.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/dto/result.dto.ts#L23)

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

## Methods

### error()

> `static` **error**(`reason`, `statusCode`): `CheckInResponseDto`

Defined in: [src/attendance/dto/check-in-response.dto.ts:48](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/check-in-response.dto.ts#L48)

Factory method to create an error response for failed check-in attempts.

#### Parameters

##### reason

`string`

Description of the failure reason.

##### statusCode

`number` = `400`

Optional HTTP status code (default: 400).

#### Returns

`CheckInResponseDto`

A response DTO with error details.

---

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

---

### success()

> `static` **success**(`attendance`): `CheckInResponseDto`

Defined in: [src/attendance/dto/check-in-response.dto.ts:34](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/dto/check-in-response.dto.ts#L34)

Factory method to create a successful check-in response.

#### Parameters

##### attendance

[`Attendance`](../../../entities/attendance.entity/classes/Attendance.md)

The attendance record created during check-in.

#### Returns

`CheckInResponseDto`

A response DTO with success state and attendance data.
