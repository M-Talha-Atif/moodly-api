[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [booking/services/booking-cancellation.service](../README.md) / BookingCancellationService

# Class: BookingCancellationService

Defined in: [src/booking/services/booking-cancellation.service.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-cancellation.service.ts#L15)

## Constructors

### Constructor

> **new BookingCancellationService**(`transactionService`, `validationService`, `sideEffectsService`, `errorHandler`, `attendanceService`, `gateway`): `BookingCancellationService`

Defined in: [src/booking/services/booking-cancellation.service.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-cancellation.service.ts#L18)

#### Parameters

##### transactionService

[`TransactionService`](../../../../common/services/transaction.service/classes/TransactionService.md)

##### validationService

[`BookingValidationService`](../../booking-validation.service/classes/BookingValidationService.md)

##### sideEffectsService

[`BookingSideEffectsService`](../../booking-side-effects.service/classes/BookingSideEffectsService.md)

##### errorHandler

[`BookingErrorHandler`](../../booking-error-handler.service/classes/BookingErrorHandler.md)

##### attendanceService

[`AttendanceService`](../../../../attendance/attendance.service/classes/AttendanceService.md)

##### gateway

[`ExperienceGateway`](../../../../experience/experience.gateway/classes/ExperienceGateway.md)

#### Returns

`BookingCancellationService`

## Methods

### cancelBooking()

> **cancelBooking**(`userId`, `bookingId`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/booking/services/booking-cancellation.service.ts:27](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-cancellation.service.ts#L27)

#### Parameters

##### userId

`string`

##### bookingId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>
