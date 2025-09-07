[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [attendance/attendance.service](../README.md) / AttendanceService

# Class: AttendanceService

Defined in: [src/attendance/attendance.service.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.service.ts#L23)

AttendanceService

Handles the full attendance lifecycle:

- On booking confirmation → creates attendance records with join codes, JWTs, and QR codes.
- Sends attendance QR codes via email notifications.
- On check-in → verifies tokens, validates session time, and marks attendance as "present".

## Constructors

### Constructor

> **new AttendanceService**(`attendanceRepo`, `notificationService`, `configService`): `AttendanceService`

Defined in: [src/attendance/attendance.service.ts:30](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.service.ts#L30)

Constructor initializes repository and dependencies.
Also validates that a JWT secret is provided via environment variables.

#### Parameters

##### attendanceRepo

`Repository`\<[`Attendance`](../../entities/attendance.entity/classes/Attendance.md)\>

##### notificationService

[`NotificationService`](../../../notification/notification.service/classes/NotificationService.md)

##### configService

`ConfigService`

#### Returns

`AttendanceService`

## Methods

### checkIn()

> **checkIn**(`token`): `Promise`\<[`CheckInResponseDto`](../../dto/check-in-response.dto/classes/CheckInResponseDto.md)\>

Defined in: [src/attendance/attendance.service.ts:114](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.service.ts#L114)

Verifies and processes user check-in.

Flow:

1. Validate provided JWT token.
2. Locate corresponding attendance by joinCode.
3. Ensure check-in occurs within allowed time window:
   - Not earlier than 1 hour before session start.
   - Not after session end.
4. Mark attendance as "present" and set check-in timestamp.

#### Parameters

##### token

`string`

The JWT token from QR code or client app.

#### Returns

`Promise`\<[`CheckInResponseDto`](../../dto/check-in-response.dto/classes/CheckInResponseDto.md)\>

Success response with attendance, or error response.

---

### createAttendance()

> **createAttendance**(`user`, `bookingId`, `experience`): `Promise`\<[`CreateAttendanceResponseDto`](../../dto/create-attendance-response.dto/classes/CreateAttendanceResponseDto.md)\>

Defined in: [src/attendance/attendance.service.ts:59](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.service.ts#L59)

Creates an attendance record for a booking.

Flow:

1. Generate a join code + JWT token.
2. Create a QR code from the token.
3. Persist attendance record in DB.
4. Send QR code to user via email notification.

#### Parameters

##### user

`any`

The user making the booking.

##### bookingId

`string`

The booking ID associated with this attendance.

##### experience

`any`

The experience details (contains session info).

#### Returns

`Promise`\<[`CreateAttendanceResponseDto`](../../dto/create-attendance-response.dto/classes/CreateAttendanceResponseDto.md)\>

Success response with attendance and token.

---

### deleteByBookingId()

> **deleteByBookingId**(`bookingId`): `Promise`\<`void`\>

Defined in: [src/attendance/attendance.service.ts:152](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.service.ts#L152)

Deletes attendance records associated with a specific booking.

#### Parameters

##### bookingId

`string`

The booking ID to delete attendance records for.

#### Returns

`Promise`\<`void`\>
