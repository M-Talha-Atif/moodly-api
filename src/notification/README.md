# Notification Module

`src/notification`: in-app notifications, real-time Socket.IO delivery, and email via a BullMQ-backed queue.

## Structure

```
notification/
├── notification.module.ts
├── notification.constants.ts     # SMTP port defaults
├── notification.controller.ts   # @Controller('notification')
├── notification.service.ts
├── notification.gateway.ts       # Socket.IO: sendToUser(userId, notification) → room `userId`
├── email.service.ts              # Nodemailer wrapper
├── entities/
│   └── notification.entity.ts
└── jobs/
    └── notification.processor.ts   # @Processor('notification-queue')
```

## How `createAndSend` works

`NotificationService.createAndSend(dto)`, called from other modules (e.g. booking side effects), does three things in sequence:
1. Persists a `Notification` row.
2. Pushes it immediately over Socket.IO to the target user's room (`NotificationGateway.sendToUser`).
3. If an email is present on the DTO, enqueues a `send` job (`{ type: 'email', data }`) onto the BullMQ `notification-queue`, processed asynchronously by `NotificationProcessor` via `EmailService.sendMail(...)`.

`type: 'push'` is handled in the processor's switch but is a stub: no push-notification integration exists yet.

## Endpoints

`@Controller('notification')`, `JwtCookieGuard` applied per-route

| Method | Route | Description |
|---|---|---|
| POST | `/v1/notification` | Create + send a notification. **Note:** the handler carries `@Roles('host')` but `RolesGuard` is not included in this route's `@UseGuards(...)`, so the host-only restriction does not actually run today: any authenticated user can currently call this endpoint. Worth fixing before relying on it as host-only. |
| GET | `/v1/notification` | List notifications for the logged-in user, filterable by `type` and `read` |
| PATCH | `/v1/notification/:id/read` | Mark one notification as read |
| PATCH | `/v1/notification/read-all` | Mark all of the user's notifications as read |
