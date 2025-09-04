[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [auth/dto/login.dto](../README.md) / LoginDto

# Class: LoginDto

Defined in: [src/auth/dto/login.dto.ts:9](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/login.dto.ts#L9)

DTO representing the payload for login requests.

Validates incoming login data using class-validator decorators
to ensure request integrity before reaching the service layer.

## Constructors

### Constructor

> **new LoginDto**(): `LoginDto`

#### Returns

`LoginDto`

## Properties

### email

> **email**: `string`

Defined in: [src/auth/dto/login.dto.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/login.dto.ts#L15)

The user's email address.
Must be a valid email format.

***

### password

> **password**: `string`

Defined in: [src/auth/dto/login.dto.ts:22](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/login.dto.ts#L22)

The user's password in plain text.
Must be provided as a non-empty string.
