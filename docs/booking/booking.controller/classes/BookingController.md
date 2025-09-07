[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [booking/booking.controller](../README.md) / BookingController

# Class: BookingController

Defined in: [src/booking/booking.controller.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L23)

## Constructors

### Constructor

> **new BookingController**(`bookingService`): `BookingController`

Defined in: [src/booking/booking.controller.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L24)

#### Parameters

##### bookingService

[`BookingService`](../../services/booking.service/classes/BookingService.md)

#### Returns

`BookingController`

## Methods

### cancelBooking()

> **cancelBooking**(`bookingId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/booking/booking.controller.ts:79](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L79)

#### Parameters

##### bookingId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

---

### create()

> **create**(`createBookingDto`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>

Defined in: [src/booking/booking.controller.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L32)

#### Parameters

##### createBookingDto

[`CreateBookingDto`](../../dto/create-booking.dto/classes/CreateBookingDto.md)

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingResponseDto`](../../dto/booking-response.dto/classes/BookingResponseDto.md)\>\>

---

### findAllBookings()

> **findAllBookings**(`req`, `page`, `limit`, `status?`, `timeFilter?`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

Defined in: [src/booking/booking.controller.ts:138](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L138)

#### Parameters

##### req

`any`

##### page

`number` = `1`

##### limit

`number` = `10`

##### status?

`"confirmed"` | `"cancelled"` | `"waitlisted"`

##### timeFilter?

`"today"` | `"tomorrow"` | `"weekend"` | `"next-week"`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`unknown`\>\>

---

### getBookingDetail()

> **getBookingDetail**(`bookingId`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingDetailDto`](../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>\>

Defined in: [src/booking/booking.controller.ts:181](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/booking.controller.ts#L181)

#### Parameters

##### bookingId

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<[`BookingDetailDto`](../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>\>
