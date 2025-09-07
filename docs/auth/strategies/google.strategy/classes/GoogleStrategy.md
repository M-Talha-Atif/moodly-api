[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [auth/strategies/google.strategy](../README.md) / GoogleStrategy

# Class: GoogleStrategy

Defined in: [src/auth/strategies/google.strategy.ts:16](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/strategies/google.strategy.ts#L16)

GoogleStrategy

Handles Google OAuth2 login via Passport.

- Ensures environment variables are set at runtime.
- Creates or fetches user via AuthService.
- Issues JWT token to frontend.

## Extends

- `Strategy`\<`this`\> & `PassportStrategyMixin`\<`unknown`, `this`\>

## Constructors

### Constructor

> **new GoogleStrategy**(`authService`): `GoogleStrategy`

Defined in: [src/auth/strategies/google.strategy.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/strategies/google.strategy.ts#L17)

#### Parameters

##### authService

[`AuthService`](../../../auth.service/classes/AuthService.md)

#### Returns

`GoogleStrategy`

#### Overrides

`PassportStrategy(Strategy, 'google').constructor`

## Properties

### \_oauth2

> `protected` **\_oauth2**: `OAuth2`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:14

NOTE: The \_oauth2 property is considered "protected". Subclasses are
allowed to use it when making protected resource requests to retrieve
the user profile.

#### Inherited from

`PassportStrategy(Strategy, 'google')._oauth2`

---

### name

> **name**: `string`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:7

#### Inherited from

`PassportStrategy(Strategy, 'google').name`

## Methods

### authenticate()

> **authenticate**(`req`, `options?`): `void`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:19

Authenticate request.

This function must be overridden by subclasses. In abstract form, it always
throws an exception.

#### Parameters

##### req

`Request`

##### options?

`any`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').authenticate`

---

### authorizationParams()

> **authorizationParams**(`options`): `object`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:22

#### Parameters

##### options

`any`

#### Returns

`object`

#### Inherited from

`PassportStrategy(Strategy, 'google').authorizationParams`

---

### error()

> **error**(`err`): `void`

Defined in: node_modules/@types/passport/index.d.ts:757

Internal error while performing authentication.

Strategies should call this function when an internal error occurs
during the process of performing authentication; for example, if the
user directory is not available.

#### Parameters

##### err

`any`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').error`

---

### fail()

> **fail**(`challenge?`, `status?`): `void`

Defined in: node_modules/@types/passport/index.d.ts:734

Fail authentication, with optional `challenge` and `status`, defaulting
to `401`.

Strategies should call this function to fail an authentication attempt.

#### Parameters

##### challenge?

`string` | `number` | `StrategyFailure`

##### status?

`number`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').fail`

---

### parseErrorResponse()

> **parseErrorResponse**(`body`, `status`): `null` \| `Error`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:24

#### Parameters

##### body

`any`

##### status

`number`

#### Returns

`null` \| `Error`

#### Inherited from

`PassportStrategy(Strategy, 'google').parseErrorResponse`

---

### pass()

> **pass**(): `void`

Defined in: node_modules/@types/passport/index.d.ts:749

Pass without making a success or fail decision.

Under most circumstances, Strategies should not need to call this
function. It exists primarily to allow previous authentication state
to be restored, for example from an HTTP session.

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').pass`

---

### redirect()

> **redirect**(`url`, `status?`): `void`

Defined in: node_modules/@types/passport/index.d.ts:741

Redirect to `url` with optional `status`, defaulting to 302.

Strategies should call this function to redirect the user (via their
user agent) to a third-party website for authentication.

#### Parameters

##### url

`string`

##### status?

`number`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').redirect`

---

### success()

> **success**(`user`, `info?`): `void`

Defined in: node_modules/@types/passport/index.d.ts:727

Authenticate `user`, with optional `info`.

Strategies should call this function to successfully authenticate a
user. `user` should be an object supplied by the application after it
has been given an opportunity to verify credentials. `info` is an
optional argument containing additional user information. This is
useful for third-party authentication strategies to pass profile
details.

#### Parameters

##### user

`User`

##### info?

`object`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').success`

---

### tokenParams()

> **tokenParams**(`options`): `object`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:23

#### Parameters

##### options

`any`

#### Returns

`object`

#### Inherited from

`PassportStrategy(Strategy, 'google').tokenParams`

---

### userProfile()

> **userProfile**(`accessToken`, `done`): `void`

Defined in: node_modules/@types/passport-oauth2/index.d.ts:21

#### Parameters

##### accessToken

`string`

##### done

(`err?`, `profile?`) => `void`

#### Returns

`void`

#### Inherited from

`PassportStrategy(Strategy, 'google').userProfile`

---

### validate()

> **validate**(`req`, `accessToken`, `refreshToken`, `profile`, `done`): `Promise`\<`void`\>

Defined in: [src/auth/strategies/google.strategy.ts:50](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/strategies/google.strategy.ts#L50)

validate()

Called by Passport after Google OAuth is successful.

- Extracts user info from Google profile
- Creates or fetches the user from database
- Returns user object which Passport attaches to req.user

#### Parameters

##### req

`Request`

Express request object

##### accessToken

`string`

Google access token

##### refreshToken

`string`

Google refresh token

##### profile

`any`

Google profile object

##### done

`VerifyCallback`

Passport callback

#### Returns

`Promise`\<`void`\>

#### Overrides

`PassportStrategy(Strategy, 'google').validate`
