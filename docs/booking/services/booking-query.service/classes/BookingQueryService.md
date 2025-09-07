[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [booking/services/booking-query.service](../README.md) / BookingQueryService

# Class: BookingQueryService

Defined in: [src/booking/services/booking-query.service.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-query.service.ts#L10)

## Constructors

### Constructor

> **new BookingQueryService**(`bookingRepository`, `mapperService`, `filterService`): `BookingQueryService`

Defined in: [src/booking/services/booking-query.service.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-query.service.ts#L11)

#### Parameters

##### bookingRepository

`Repository`\<[`Booking`](../../../entities/booking.entity/classes/Booking.md)\>

##### mapperService

[`BookingMapperService`](../../booking-mapper.service/classes/BookingMapperService.md)

##### filterService

[`BookingFilterService`](../../booking-filter.service/classes/BookingFilterService.md)

#### Returns

`BookingQueryService`

## Methods

### findAllBookings()

> **findAllBookings**(`page`, `limit`, `userId?`, `status?`, `timeFilter?`): `Promise`\<\{ `data`: [`BookingResponseDto`](../../../dto/booking-response.dto/classes/BookingResponseDto.md)[]; `total`: `number`; \}\>

Defined in: [src/booking/services/booking-query.service.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-query.service.ts#L18)

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

> **findBookingById**(`userId`, `bookingId`): `Promise`\<`null` \| [`BookingDetailDto`](../../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>

Defined in: [src/booking/services/booking-query.service.ts:67](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-query.service.ts#L67)

#### Parameters

##### userId

`string`

##### bookingId

`string`

#### Returns

`Promise`\<`null` \| [`BookingDetailDto`](../../../dto/booking-detail.dto/classes/BookingDetailDto.md)\>
