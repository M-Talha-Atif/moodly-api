[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [auth/dto/signup.dto](../README.md) / SignUpDto

# Class: SignUpDto

Defined in: [src/auth/dto/signup.dto.ts:49](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L49)

DTO for handling user sign-up requests.

Validates and transforms incoming data when a new user registers.

## Constructors

### Constructor

> **new SignUpDto**(): `SignUpDto`

#### Returns

`SignUpDto`

## Properties

### avatarUrl?

> `optional` **avatarUrl**: `string`

Defined in: [src/auth/dto/signup.dto.ts:80](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L80)

URL of the user's avatar/profile picture.
Optional field.

***

### communicationStyle?

> `optional` **communicationStyle**: `string`

Defined in: [src/auth/dto/signup.dto.ts:105](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L105)

Preferred communication style (e.g., formal, casual).

***

### culturalBackground?

> `optional` **culturalBackground**: `object`

Defined in: [src/auth/dto/signup.dto.ts:87](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L87)

User’s cultural background information.
May include ethnicity, religion, and personal values.

#### ethnicity?

> `optional` **ethnicity**: `string`

#### religion?

> `optional` **religion**: `string`

#### values?

> `optional` **values**: `string`[]

***

### email

> **email**: `string`

Defined in: [src/auth/dto/signup.dto.ts:55](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L55)

The user's email address.
Must be in valid email format.

***

### languagePreferences?

> `optional` **languagePreferences**: `string`[]

Defined in: [src/auth/dto/signup.dto.ts:98](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L98)

Languages the user prefers for communication.

***

### name?

> `optional` **name**: `string`

Defined in: [src/auth/dto/signup.dto.ts:72](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L72)

The user's display name.
Optional field.

***

### password

> **password**: `string`

Defined in: [src/auth/dto/signup.dto.ts:64](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L64)

The user's account password.
Must be between 8 and 64 characters.

***

### privacySettings?

> `optional` **privacySettings**: `PrivacySettingsDto`

Defined in: [src/auth/dto/signup.dto.ts:113](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L113)

User-defined privacy settings.

***

### role?

> `optional` **role**: [`UserRole`](../../../../common/enums/user.enums/enumerations/UserRole.md)

Defined in: [src/auth/dto/signup.dto.ts:121](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L121)

User role within the system.
Defaults are usually handled by the service layer.
