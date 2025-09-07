[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [users/users.controller](../README.md) / UsersController

# Class: UsersController

Defined in: [src/users/users.controller.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L23)

## Constructors

### Constructor

> **new UsersController**(`usersService`): `UsersController`

Defined in: [src/users/users.controller.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L24)

#### Parameters

##### usersService

[`UsersService`](../../users.service/classes/UsersService.md)

#### Returns

`UsersController`

## Methods

### create()

> **create**(`createUserDto`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.controller.ts:31](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L31)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

---

### findAll()

> **findAll**(): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)[]\>

Defined in: [src/users/users.controller.ts:41](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L41)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)[]\>

---

### findOne()

> **findOne**(`id`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.controller.ts:50](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L50)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

---

### remove()

> **remove**(`id`): `Promise`\<`void`\>

Defined in: [src/users/users.controller.ts:69](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L69)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### update()

> **update**(`id`, `updateUserDto`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.controller.ts:60](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.controller.ts#L60)

#### Parameters

##### id

`string`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>
