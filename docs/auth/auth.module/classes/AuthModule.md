[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [auth/auth.module](../README.md) / AuthModule

# Class: AuthModule

Defined in: [src/auth/auth.module.ts:41](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/auth.module.ts#L41)

AuthModule

Provides authentication functionality including:

- User signup & login
- JWT-based authentication
- Logout with cookie management

Imports:

- UsersModule: for user management and persistence
- JwtModule: for JWT token creation/verification

Exports:

- JwtModule: so other modules (e.g. guards) can use it globally

## Constructors

### Constructor

> **new AuthModule**(): `AuthModule`

#### Returns

`AuthModule`
