[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [attendance/attendance.controller](../README.md) / AttendanceController

# Class: AttendanceController

Defined in: [src/attendance/attendance.controller.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.controller.ts#L12)

Controller responsible for managing attendance-related operations.
Handles incoming requests and delegates business logic to the
AttendanceService.

## Constructors

### Constructor

> **new AttendanceController**(`attendanceService`): `AttendanceController`

Defined in: [src/attendance/attendance.controller.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.controller.ts#L13)

#### Parameters

##### attendanceService

[`AttendanceService`](../../attendance.service/classes/AttendanceService.md)

#### Returns

`AttendanceController`

## Methods

### checkIn()

> **checkIn**(`token`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/attendance/attendance.controller.ts:28](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.controller.ts#L28)

Handles user check-in requests.

Endpoint: POST /attendance/check-in

Validates the provided token (e.g., QR code, JWT) and updates
the attendance record accordingly.

#### Parameters

##### token

`string`

Authentication/validation token provided in the request body.

##### res

`Response`

Express Response object used to return structured JSON responses.

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

JSON object with the check-in result and corresponding HTTP status code.
