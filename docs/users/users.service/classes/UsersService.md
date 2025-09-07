[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [users/users.service](../README.md) / UsersService

# Class: UsersService

Defined in: [src/users/users.service.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L15)

## Constructors

### Constructor

> **new UsersService**(`usersRepository`, `privacyRepository`): `UsersService`

Defined in: [src/users/users.service.ts:16](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L16)

#### Parameters

##### usersRepository

`Repository`\<[`User`](../../entities/user.entity/classes/User.md)\>

##### privacyRepository

`Repository`\<[`PrivacySettings`](../../entities/privacy.entity/classes/PrivacySettings.md)\>

#### Returns

`UsersService`

## Methods

### create()

> **create**(`createUserDto`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.service.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L23)

#### Parameters

##### createUserDto

[`CreateUserDto`](../../dto/create-user.dto/classes/CreateUserDto.md)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

---

### findAll()

> **findAll**(): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)[]\>

Defined in: [src/users/users.service.ts:61](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L61)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)[]\>

---

### findByEmail()

> **findByEmail**(`email`, `includePassword`): `Promise`\<`null` \| [`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.service.ts:74](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L74)

#### Parameters

##### email

`string`

##### includePassword

`boolean` = `false`

#### Returns

`Promise`\<`null` \| [`User`](../../entities/user.entity/classes/User.md)\>

---

### findById()

> **findById**(`id`): `Promise`\<`null` \| [`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.service.ts:109](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L109)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`null` \| [`User`](../../entities/user.entity/classes/User.md)\>

---

### findOne()

> **findOne**(`id`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.service.ts:65](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L65)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

---

### remove()

> **remove**(`id`): `Promise`\<`void`\>

Defined in: [src/users/users.service.ts:105](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L105)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

---

### update()

> **update**(`id`, `updateUserDto`): `Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>

Defined in: [src/users/users.service.ts:99](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/users.service.ts#L99)

#### Parameters

##### id

`string`

##### updateUserDto

[`UpdateUserDto`](../../dto/update-user.dto/classes/UpdateUserDto.md)

#### Returns

`Promise`\<[`User`](../../entities/user.entity/classes/User.md)\>
