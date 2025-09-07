[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [auth/auth.controller](../README.md) / AuthController

# Class: AuthController

Defined in: [src/auth/auth.controller.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L22)

## Constructors

### Constructor

> **new AuthController**(`authService`): `AuthController`

Defined in: [src/auth/auth.controller.ts:23](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L23)

#### Parameters

##### authService

[`AuthService`](../../auth.service/classes/AuthService.md)

#### Returns

`AuthController`

## Methods

### getMe()

> **getMe**(`req`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/auth/auth.controller.ts:108](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L108)

#### Parameters

##### req

`Request`

##### res

`Response`

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

---

### googleCallback()

> **googleCallback**(`req`, `res`): `Promise`\<`void`\>

Defined in: [src/auth/auth.controller.ts:82](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L82)

#### Parameters

##### req

`any`

##### res

`Response`

#### Returns

`Promise`\<`void`\>

---

### googleLogin()

> **googleLogin**(): `Promise`\<`void`\>

Defined in: [src/auth/auth.controller.ts:75](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L75)

Initiates Google OAuth flow

#### Returns

`Promise`\<`void`\>

---

### login()

> **login**(`loginDto`, `response`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/auth/auth.controller.ts:38](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L38)

#### Parameters

##### loginDto

[`LoginDto`](../../dto/login.dto/classes/LoginDto.md)

##### response

`Response`

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

---

### logout()

> **logout**(`response`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/auth/auth.controller.ts:60](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L60)

#### Parameters

##### response

`Response`

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

---

### signUp()

> **signUp**(`signUpDto`, `res`): `Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>

Defined in: [src/auth/auth.controller.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.controller.ts#L29)

#### Parameters

##### signUpDto

[`SignUpDto`](../../dto/signup.dto/classes/SignUpDto.md)

##### res

`Response`

#### Returns

`Promise`\<`Response`\<`any`, `Record`\<`string`, `any`\>\>\>
