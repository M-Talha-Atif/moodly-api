[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [notification/notification.service](../README.md) / NotificationService

# Class: NotificationService

Defined in: [src/notification/notification.service.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L13)

## Constructors

### Constructor

> **new NotificationService**(`notificationRepo`, `gateway`, `notificationQueue`): `NotificationService`

Defined in: [src/notification/notification.service.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L14)

#### Parameters

##### notificationRepo

`Repository`\<[`Notification`](../../entities/notification.entity/classes/Notification.md)\>

##### gateway

[`NotificationGateway`](../../notification.gateway/classes/NotificationGateway.md)

##### notificationQueue

`Queue`

#### Returns

`NotificationService`

## Methods

### createAndSend()

> **createAndSend**(`dto`): `Promise`\<[`Notification`](../../entities/notification.entity/classes/Notification.md)\>

Defined in: [src/notification/notification.service.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L22)

#### Parameters

##### dto

[`CreateNotificationDto`](../../dto/create-notification.dto/classes/CreateNotificationDto.md)

#### Returns

`Promise`\<[`Notification`](../../entities/notification.entity/classes/Notification.md)\>

***

### getUserNotifications()

> **getUserNotifications**(`userId`, `filters`): `Promise`\<`object`[]\>

Defined in: [src/notification/notification.service.ts:59](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L59)

#### Parameters

##### userId

`string`

##### filters

###### read?

`boolean`

###### type?

`string`

#### Returns

`Promise`\<`object`[]\>

***

### markAllAsRead()

> **markAllAsRead**(`userId`): `Promise`\<\{ `read`: `boolean`; `userId`: `string`; \}\>

Defined in: [src/notification/notification.service.ts:95](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L95)

#### Parameters

##### userId

`string`

#### Returns

`Promise`\<\{ `read`: `boolean`; `userId`: `string`; \}\>

***

### markAsRead()

> **markAsRead**(`id`, `userId`): `Promise`\<\{ `id`: `string`; `read`: `boolean`; \}\>

Defined in: [src/notification/notification.service.ts:83](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L83)

#### Parameters

##### id

`string`

##### userId

`string`

#### Returns

`Promise`\<\{ `id`: `string`; `read`: `boolean`; \}\>

***

### sendEmail()

> **sendEmail**(`emailDto`): `Promise`\<`void`\>

Defined in: [src/notification/notification.service.ts:52](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.service.ts#L52)

#### Parameters

##### emailDto

[`SendEmailNotificationDto`](../../dto/send-email-notification.dto/classes/SendEmailNotificationDto.md)

#### Returns

`Promise`\<`void`\>
