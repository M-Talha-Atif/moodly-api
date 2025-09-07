[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [booking/services/booking-validation.service](../README.md) / BookingValidationService

# Class: BookingValidationService

Defined in: [src/booking/services/booking-validation.service.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-validation.service.ts#L12)

## Constructors

### Constructor

> **new BookingValidationService**(): `BookingValidationService`

#### Returns

`BookingValidationService`

## Methods

### validateBookingAllowed()

> **validateBookingAllowed**(`existingBooking`, `experience`): `void`

Defined in: [src/booking/services/booking-validation.service.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-validation.service.ts#L26)

#### Parameters

##### existingBooking

`null` | [`Booking`](../../../entities/booking.entity/classes/Booking.md)

##### experience

[`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)

#### Returns

`void`

---

### validateCancellationAllowed()

> **validateCancellationAllowed**(`booking`, `experience`, `now`): `void`

Defined in: [src/booking/services/booking-validation.service.ts:39](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-validation.service.ts#L39)

#### Parameters

##### booking

[`Booking`](../../../entities/booking.entity/classes/Booking.md)

##### experience

[`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)

##### now

`Date`

#### Returns

`void`

---

### validateExperienceExists()

> **validateExperienceExists**(`manager`, `experienceId`): `Promise`\<`void`\>

Defined in: [src/booking/services/booking-validation.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/booking/services/booking-validation.service.ts#L13)

#### Parameters

##### manager

`EntityManager`

##### experienceId

`string`

#### Returns

`Promise`\<`void`\>
