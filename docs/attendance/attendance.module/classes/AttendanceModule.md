[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [attendance/attendance.module](../README.md) / AttendanceModule

# Class: AttendanceModule

Defined in: [src/attendance/attendance.module.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/attendance/attendance.module.ts#L31)

AttendanceModule

This module encapsulates all attendance-related functionality,
including entity persistence, business logic, and API endpoints.

Responsibilities:

- Registers the Attendance entity with TypeORM.
- Provides AttendanceService for handling business logic (check-ins, status updates, etc.).
- Exposes AttendanceController for REST API endpoints.
- Integrates with NotificationModule to send notifications
  on key attendance-related events (e.g., successful check-in).

## Constructors

### Constructor

> **new AttendanceModule**(): `AttendanceModule`

#### Returns

`AttendanceModule`
