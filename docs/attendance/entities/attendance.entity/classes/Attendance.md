[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [attendance/entities/attendance.entity](../README.md) / Attendance

# Class: Attendance

Defined in: [src/attendance/entities/attendance.entity.ts:20](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L20)

Attendance entity representing a user's participation
in an experience, tied to a specific booking.

## Constructors

### Constructor

> **new Attendance**(): `Attendance`

#### Returns

`Attendance`

## Properties

### booking

> **booking**: [`Booking`](../../../../booking/entities/booking.entity/classes/Booking.md)

Defined in: [src/attendance/entities/attendance.entity.ts:37](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L37)

One-to-one relationship with Booking.
Each booking can have at most one attendance record.
Cascade delete ensures that when a booking is removed,
its attendance record is also deleted.

---

### bookingId

> **bookingId**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:43](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L43)

Foreign key reference to the related booking.

---

### checkInTime

> **checkInTime**: `Date`

Defined in: [src/attendance/entities/attendance.entity.ts:84](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L84)

Timestamp marking when the user checked in.

---

### checkOutTime

> **checkOutTime**: `Date`

Defined in: [src/attendance/entities/attendance.entity.ts:90](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L90)

Timestamp marking when the user checked out.

---

### createdAt

> **createdAt**: `Date`

Defined in: [src/attendance/entities/attendance.entity.ts:116](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L116)

Record creation timestamp (automatically managed).

---

### experience

> **experience**: [`Experience`](../../../../experience/entities/experience.entity/classes/Experience.md)

Defined in: [src/attendance/entities/attendance.entity.ts:65](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L65)

Many-to-one relationship with Experience.
Multiple attendances can be tied to a single experience.

---

### experienceId

> **experienceId**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:71](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L71)

Foreign key reference to the related experience.

---

### id

> **id**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:25](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L25)

Unique identifier for the attendance record (UUID).

---

### joinCode

> **joinCode**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:104](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L104)

Unique join code used for validating attendance entry.

---

### method

> **method**: `"in_person"` \| `"virtual"`

Defined in: [src/attendance/entities/attendance.entity.ts:98](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L98)

Method of attendance.
Can be "virtual" (remote) or "in_person" (physical).
Defaults to "in_person".

---

### qrCodeUrl?

> `optional` **qrCodeUrl**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:110](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L110)

Optional QR code URL for quick check-in/out scanning.

---

### status

> **status**: `"pending"` \| `"present"` \| `"absent"`

Defined in: [src/attendance/entities/attendance.entity.ts:78](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L78)

Attendance status.
Defaults to "pending" until check-in/out is completed.

---

### updatedAt

> **updatedAt**: `Date`

Defined in: [src/attendance/entities/attendance.entity.ts:122](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L122)

Record last update timestamp (automatically managed).

---

### user

> **user**: [`User`](../../../../users/entities/user.entity/classes/User.md)

Defined in: [src/attendance/entities/attendance.entity.ts:51](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L51)

Many-to-one relationship with User.
A user can have multiple attendance records.

---

### userId

> **userId**: `string`

Defined in: [src/attendance/entities/attendance.entity.ts:57](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/entities/attendance.entity.ts#L57)

Foreign key reference to the related user.
