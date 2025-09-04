[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [booking/services/booking-creation.service](../README.md) / BookingCreationService

# Class: BookingCreationService

Defined in: [src/booking/services/booking-creation.service.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-creation.service.ts#L22)

## Constructors

### Constructor

> **new BookingCreationService**(`bookingRepository`, `gateway`, `experienceRepository`, `transactionService`, `validationService`, `sideEffectsService`, `mapperService`): `BookingCreationService`

Defined in: [src/booking/services/booking-creation.service.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-creation.service.ts#L25)

#### Parameters

##### bookingRepository

`Repository`\<[`Booking`](../../../entities/booking.entity/classes/Booking.md)\>

##### gateway

[`ExperienceGateway`](../../../../experience/experience.gateway/classes/ExperienceGateway.md)

##### experienceRepository

`Repository`\<[`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)\>

##### transactionService

[`TransactionService`](../../../../common/services/transaction.service/classes/TransactionService.md)

##### validationService

[`BookingValidationService`](../../booking-validation.service/classes/BookingValidationService.md)

##### sideEffectsService

[`BookingSideEffectsService`](../../booking-side-effects.service/classes/BookingSideEffectsService.md)

##### mapperService

[`BookingMapperService`](../../booking-mapper.service/classes/BookingMapperService.md)

#### Returns

`BookingCreationService`

## Methods

### createBooking()

> **createBooking**(`userId`, `dto`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>

Defined in: [src/booking/services/booking-creation.service.ts:37](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-creation.service.ts#L37)

#### Parameters

##### userId

`string`

##### dto

[`CreateBookingDto`](../../../dto/create-booking.dto/classes/CreateBookingDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>
