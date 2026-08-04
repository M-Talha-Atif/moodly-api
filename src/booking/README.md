# Booking Module

`src/booking`: booking lifecycle: create, cancel, list, detail, stats, host dashboards. See [root README > Sample Request Flow](../../README.md#sample-request-flow--creating-a-booking) for a full trace of `POST /user/bookings`, and [Engineering Challenges](../../README.md#engineering-challenges-handled) for how double-booking races are prevented.

## Structure

```
booking/
├── booking.module.ts
├── booking.constants.ts   # pagination defaults, trend window, refund cutoff window
├── controller/
│   ├── user-booking.controller.ts   # @Controller('user/bookings')
│   └── host-booking.controller.ts   # @Controller('host/bookings')
├── services/user/
│   ├── booking.service.ts            # orchestrator, delegates to the below
│   ├── booking-creation.service.ts   # atomic capacity check + insert (raw SQL, FOR UPDATE)
│   ├── booking-cancellation.service.ts
│   ├── booking-validation.service.ts
│   ├── booking-query.service.ts
│   ├── booking-filter.service.ts
│   ├── booking-mapper.service.ts
│   ├── booking-side-effects.service.ts   # attendance + notification, fired after commit
│   ├── booking-error-handler.service.ts
│   └── booking.stats.service.ts
├── services/host/
│   ├── host-booking-query.service.ts
│   └── host-booking-stats.service.ts
├── dto/
│   ├── create-booking.dto.ts   # { experienceId: string (UUID) }
│   ├── booking-response.dto.ts
│   └── booking-detail.dto.ts
└── entities/
    └── booking.entity.ts
```

## Entity notes

`Booking`: `experience` + `user` FKs (unique composite index: one active booking per user per experience), `attendance` (1:1), `status` (`confirmed`/`cancelled`/`waitlisted`), `cancelledAt`.

## Concurrency

Booking creation and cancellation both go through `TransactionService.withTransaction` (`src/common/services/transaction.service.ts`), which opens a dedicated `QueryRunner` and runs at `READ COMMITTED` isolation. Creation specifically uses one raw-SQL CTE that `SELECT ... FOR UPDATE`s the target experience row, checks for an existing (possibly cancelled) booking, and atomically inserts/restores + increments `spotsFilled`: see [root README](../../README.md#engineering-challenges-handled) for the full statement and reasoning.

## Endpoints

### User: `@Controller('user/bookings')`, `JwtBearerGuard, JwtCookieGuard, RolesGuard`, `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| POST | `/user/bookings` | Create a booking `{ experienceId }` |
| DELETE | `/user/bookings/:id` | Cancel a booking |
| GET | `/user/bookings` | List bookings, paginated (`page`, `limit`), filterable by `status` (`confirmed`/`cancelled`/`waitlisted`) and `timeFilter` (`today`/`tomorrow`/`weekend`/`next-week`) |
| GET | `/user/bookings/stats` | `{ total, upcoming, completed }` for the current user |
| GET | `/user/bookings/:id` | Booking detail |

### Host: `@Controller('host/bookings')`, `JwtBearerGuard, JwtCookieGuard, RolesGuard` (role `host`), `@SkipThrottle()`

| Method | Route | Description |
|---|---|---|
| GET | `/host/bookings` | All bookings across the host's experiences |
| GET | `/host/bookings/recent` | 5 most recent bookings |
| GET | `/host/bookings/stats` | `{ total, revenue, experiences, avgRating }` |
| GET | `/host/bookings/trend` | 90-day booking trend (chart data) |
| GET | `/host/bookings/emotional-outcomes` | Emotional-outcome breakdown |
| GET | `/host/bookings/funnel` | Booking funnel stats |
| GET | `/host/bookings/:id` | Booking detail, host-scoped |

## Side effects after a successful booking

Fired after the DB transaction commits, not awaited by the HTTP response (`BookingSideEffectsService`):
1. `AttendanceService.createAttendance(...)`: creates the linked `Attendance` row (see [attendance module](../attendance/README.md)).
2. `NotificationService.createAndSend(...)`: persists a `Notification` row, pushes it over Socket.IO, and queues a confirmation email onto the BullMQ `notification-queue` (see [notification module](../notification/README.md)).
3. `ExperienceGateway.emitSpotsUpdate(...)`: broadcasts the updated spot count to anyone subscribed to that experience's Socket.IO room.

## Cancellation refund window

`BookingCancellationService.isRefundEligible` checks the cancellation against `CANCELLATION_REFUND_WINDOW_HOURS` (48 hours, in `booking.constants.ts`) before the experience's start time. This only computes eligibility, there is no actual refund/payment integration wired up yet.
