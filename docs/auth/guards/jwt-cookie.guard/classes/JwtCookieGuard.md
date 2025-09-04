[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [auth/guards/jwt-cookie.guard](../README.md) / JwtCookieGuard

# Class: JwtCookieGuard

Defined in: [src/auth/guards/jwt-cookie.guard.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/guards/jwt-cookie.guard.ts#L17)

JwtCookieGuard

Custom NestJS guard that:
- Extracts a JWT from the request cookies.
- Verifies the token using JwtService.
- Attaches the decoded user payload to the request object.

Usage:
- Apply to routes or controllers that require authentication.
- Returns `true` if the token is valid, otherwise blocks the request.

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new JwtCookieGuard**(`jwtService`): `JwtCookieGuard`

Defined in: [src/auth/guards/jwt-cookie.guard.ts:18](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/guards/jwt-cookie.guard.ts#L18)

#### Parameters

##### jwtService

`JwtService`

#### Returns

`JwtCookieGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `Promise`\<`boolean`\>

Defined in: [src/auth/guards/jwt-cookie.guard.ts:32](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/guards/jwt-cookie.guard.ts#L32)

Determines whether the current request is authorized.

Steps:
1. Extracts the `jwt` cookie from the request.
2. Verifies the token asynchronously with JwtService.
3. On success, attaches the decoded payload to `request.user`.
4. Returns `true` if valid, otherwise `false`.

#### Parameters

##### context

`ExecutionContext`

The execution context, giving access to the request object.

#### Returns

`Promise`\<`boolean`\>

Promise<boolean> - Whether the request can proceed.

#### Implementation of

`CanActivate.canActivate`
