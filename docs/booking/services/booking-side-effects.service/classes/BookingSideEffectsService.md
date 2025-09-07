[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [booking/services/booking-side-effects.service](../README.md) / BookingSideEffectsService

# Class: BookingSideEffectsService

Defined in: [src/booking/services/booking-side-effects.service.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-side-effects.service.ts#L9)

## Constructors

### Constructor

> **new BookingSideEffectsService**(`notificationService`, `attendanceService`): `BookingSideEffectsService`

Defined in: [src/booking/services/booking-side-effects.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-side-effects.service.ts#L12)

#### Parameters

##### notificationService

[`NotificationService`](../../../../notification/notification.service/classes/NotificationService.md)

##### attendanceService

[`AttendanceService`](../../../../attendance/attendance.service/classes/AttendanceService.md)

#### Returns

`BookingSideEffectsService`

## Methods

### queueBookingCancelledNotification()

> **queueBookingCancelledNotification**(`userId`, `user`, `experience`): `void`

Defined in: [src/booking/services/booking-side-effects.service.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-side-effects.service.ts#L22)

#### Parameters

##### userId

`string`

##### user

[`User`](../../../../users/entities/user.entity/classes/User.md)

##### experience

[`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)

#### Returns

`void`

---

### queueBookingCreatedSideEffects()

> **queueBookingCreatedSideEffects**(`booking`, `userId`): `void`

Defined in: [src/booking/services/booking-side-effects.service.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-side-effects.service.ts#L17)

#### Parameters

##### booking

[`Booking`](../../../entities/booking.entity/classes/Booking.md)

##### userId

`string`

#### Returns

`void`
