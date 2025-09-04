[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [notification/notification.controller](../README.md) / NotificationController

# Class: NotificationController

Defined in: [src/notification/notification.controller.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L32)

## Constructors

### Constructor

> **new NotificationController**(`notificationService`): `NotificationController`

Defined in: [src/notification/notification.controller.ts:33](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L33)

#### Parameters

##### notificationService

[`NotificationService`](../../notification.service/classes/NotificationService.md)

#### Returns

`NotificationController`

## Methods

### create()

> **create**(`dto`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/notification/notification.controller.ts:46](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L46)

#### Parameters

##### dto

[`CreateNotificationDto`](../../dto/create-notification.dto/classes/CreateNotificationDto.md)

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

***

### getUserNotifications()

> **getUserNotifications**(`req`, `type?`, `read?`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`[]\>\>

Defined in: [src/notification/notification.controller.ts:76](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L76)

#### Parameters

##### req

`any`

##### type?

`string`

##### read?

`string`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`[]\>\>

***

### markAllAsRead()

> **markAllAsRead**(`req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/notification/notification.controller.ts:129](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L129)

#### Parameters

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

***

### markAsRead()

> **markAsRead**(`id`, `req`): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>

Defined in: [src/notification/notification.controller.ts:106](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/notification/notification.controller.ts#L106)

#### Parameters

##### id

`string`

##### req

`any`

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`any`\>\>
