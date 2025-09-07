[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [booking/services/booking.service](../README.md) / BookingService

# Class: BookingService

Defined in: [src/booking/services/booking.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L12)

## Constructors

### Constructor

> **new BookingService**(`bookingCreationService`, `bookingCancellationService`, `bookingQueryService`): `BookingService`

Defined in: [src/booking/services/booking.service.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L15)

#### Parameters

##### bookingCreationService

[`BookingCreationService`](../../booking-creation.service/classes/BookingCreationService.md)

##### bookingCancellationService

[`BookingCancellationService`](../../booking-cancellation.service/classes/BookingCancellationService.md)

##### bookingQueryService

[`BookingQueryService`](../../booking-query.service/classes/BookingQueryService.md)

#### Returns

`BookingService`

## Methods

### cancelBooking()

> **cancelBooking**(`userId`, `bookingId`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/booking/services/booking.service.ts:63](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L63)

#### Parameters

##### userId

`string`

##### bookingId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

---

### createBooking()

> **createBooking**(`userId`, `dto`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>

Defined in: [src/booking/services/booking.service.ts:21](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L21)

#### Parameters

##### userId

`string`

##### dto

[`CreateBookingDto`](../../../dto/create-booking.dto/classes/CreateBookingDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>

---

### findAllBookings()

> **findAllBookings**(`page`, `limit`, `userId?`, `status?`, `timeFilter?`): `Promise`\<\{ `data`: [`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)[]; `total`: `number`; \}\>

Defined in: [src/booking/services/booking.service.ts:85](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L85)

#### Parameters

##### page

`number` = `1`

##### limit

`number` = `10`

##### userId?

`string`

##### status?

`"confirmed"` | `"cancelled"` | `"waitlisted"`

##### timeFilter?

`"today"` | `"tomorrow"` | `"weekend"` | `"next-week"`

#### Returns

`Promise`\<\{ `data`: [`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)[]; `total`: `number`; \}\>

---

### findBookingById()

> **findBookingById**(`userId`, `bookingId`): `Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingDetailDto`](../../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>\>

Defined in: [src/booking/services/booking.service.ts:101](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking.service.ts#L101)

#### Parameters

##### userId

`string`

##### bookingId

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingDetailDto`](../../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>\>
