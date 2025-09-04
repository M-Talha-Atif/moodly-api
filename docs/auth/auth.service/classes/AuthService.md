[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [auth/auth.service](../README.md) / AuthService

# Class: AuthService

Defined in: [src/auth/auth.service.ts:26](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L26)

## Constructors

### Constructor

> **new AuthService**(`usersService`, `jwtService`): `AuthService`

Defined in: [src/auth/auth.service.ts:27](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L27)

#### Parameters

##### usersService

[`UsersService`](../../../users/users.service/classes/UsersService.md)

##### jwtService

`JwtService`

#### Returns

`AuthService`

## Methods

### login()

> **login**(`loginDto`): `Promise`\<[`LoginResponseDto`](../../dto/login-response.dto/classes/LoginResponseDto.md)\>

Defined in: [src/auth/auth.service.ts:71](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L71)

Authenticates a user and returns a signed JWT.

Steps:
1. Fetches user by email (with password hash).
2. Verifies the provided password using bcrypt.
3. Generates a JWT payload with user id, email, and role.
4. Signs and returns the token.

#### Parameters

##### loginDto

[`LoginDto`](../../dto/login.dto/classes/LoginDto.md)

DTO containing user login credentials.

#### Returns

`Promise`\<[`LoginResponseDto`](../../dto/login-response.dto/classes/LoginResponseDto.md)\>

LoginResponseDto with JWT access token or an error response.

***

### logout()

> **logout**(): `Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null`\>\>

Defined in: [src/auth/auth.service.ts:137](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L137)

Logs out the current user.

Note:
- Actual cookie clearing happens in the AuthController.
- This method just returns a success response object.

#### Returns

`Promise`\<[`ResultDto`](../../../common/dto/result.dto/classes/ResultDto.md)\<`null`\>\>

ResultDto with success message and 200 status.

***

### signUp()

> **signUp**(`signUpDto`): `Promise`\<[`SignUpResponseDto`](../../dto/signup-response.dto/classes/SignUpResponseDto.md)\>

Defined in: [src/auth/auth.service.ts:43](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L43)

Registers a new user.

Steps:
1. Checks if a user with the given email already exists.
2. Hashes the provided password with bcrypt.
3. Creates the user in the database with a default or provided role.

#### Parameters

##### signUpDto

[`SignUpDto`](../../dto/signup.dto/classes/SignUpDto.md)

DTO containing user registration details.

#### Returns

`Promise`\<[`SignUpResponseDto`](../../dto/signup-response.dto/classes/SignUpResponseDto.md)\>

SignUpResponseDto with created user data or an error response.

***

### validateGoogleLogin()

> **validateGoogleLogin**(`userInfo`): `Promise`\<\{ `access_token`: `string`; `user`: `any`; \}\>

Defined in: [src/auth/auth.service.ts:103](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.service.ts#L103)

Validate or create a Google OAuth user, then return JWT

#### Parameters

##### userInfo

###### avatarUrl?

`string`

###### email

`string`

###### name?

`string`

#### Returns

`Promise`\<\{ `access_token`: `string`; `user`: `any`; \}\>
