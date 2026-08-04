# Attendance Module

`src/attendance` — QR/join-code check-in, one record per `Booking`.

## Structure

```
attendance/
├── attendance.module.ts
├── attendance.controller.ts   # @Controller('attendance')
├── attendance.service.ts
├── entities/
│   └── attendance.entity.ts
└── utils/
    └── join-code.util.ts
```

## Entity notes

`Attendance`: `booking` (1:1), `user`, `experience` FKs, `status` (`pending`/`present`/`absent`), `checkIn/OutTime`, `method` (`virtual`/`in_person`), `joinCode`, `qrCodeUrl`.

## How check-in works

An `Attendance` row is created automatically as a side effect of a successful booking (see [booking module](../booking/README.md#side-effects-after-a-successful-booking)), carrying a signed token built from `ATTENDANCE_JWT_SECRET`/`ATTENDANCE_JWT_EXPIRATION` — separate from the login JWT — and a QR code encoding it. `POST /attendance/check-in` validates that token (rather than relying on a route guard) and flips the attendance status.

## Endpoints

`@Controller('attendance')` — no route guard; the token itself is the credential, validated inside the service.

| Method | Route | Description |
|---|---|---|
| POST | `/attendance/check-in` | Check in with `{ token }` (from the QR code / join link) |
