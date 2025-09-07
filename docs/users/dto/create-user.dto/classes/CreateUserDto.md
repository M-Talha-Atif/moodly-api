[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [users/dto/create-user.dto](../README.md) / CreateUserDto

# Class: CreateUserDto

Defined in: [src/users/dto/create-user.dto.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/dto/create-user.dto.ts#L6)

## Extends

- `Omit`\<[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md), `"password"`\>

## Constructors

### Constructor

> **new CreateUserDto**(): `CreateUserDto`

Defined in: node_modules/@nestjs/mapped-types/dist/mapped-type.interface.d.ts:3

#### Returns

`CreateUserDto`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).constructor`

### Constructor

> **new CreateUserDto**(...`args`): `CreateUserDto`

Defined in: node_modules/@nestjs/mapped-types/dist/mapped-type.interface.d.ts:3

#### Parameters

##### args

...`any`[]

#### Returns

`CreateUserDto`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).constructor`

## Properties

### avatarUrl?

> `optional` **avatarUrl**: `string`

Defined in: [src/auth/dto/signup.dto.ts:80](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L80)

URL of the user's avatar/profile picture.
Optional field.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`avatarUrl`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#avatarurl)

---

### communicationStyle?

> `optional` **communicationStyle**: `string`

Defined in: [src/auth/dto/signup.dto.ts:105](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L105)

Preferred communication style (e.g., formal, casual).

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`communicationStyle`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#communicationstyle)

---

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

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).culturalBackground`

---

### email

> **email**: `string`

Defined in: [src/auth/dto/signup.dto.ts:55](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L55)

The user's email address.
Must be in valid email format.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`email`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#email)

---

### languagePreferences?

> `optional` **languagePreferences**: `string`[]

Defined in: [src/auth/dto/signup.dto.ts:98](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L98)

Languages the user prefers for communication.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`languagePreferences`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#languagepreferences)

---

### name?

> `optional` **name**: `string`

Defined in: [src/auth/dto/signup.dto.ts:72](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L72)

The user's display name.
Optional field.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`name`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#name)

---

### passwordHash?

> `optional` **passwordHash**: `string`

Defined in: [src/users/dto/create-user.dto.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/dto/create-user.dto.ts#L12)

---

### privacySettings?

> `optional` **privacySettings**: `PrivacySettingsDto`

Defined in: [src/auth/dto/signup.dto.ts:113](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L113)

User-defined privacy settings.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`privacySettings`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#privacysettings)

---

### provider?

> `optional` **provider**: [`AuthProvider`](../../../../common/enums/user.enums/enumerations/AuthProvider.md)

Defined in: [src/users/dto/create-user.dto.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/users/dto/create-user.dto.ts#L15)

---

### role?

> `optional` **role**: [`UserRole`](../../../../common/enums/user.enums/enumerations/UserRole.md)

Defined in: [src/auth/dto/signup.dto.ts:121](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/auth/dto/signup.dto.ts#L121)

User role within the system.
Defaults are usually handled by the service layer.

#### Inherited from

[`SignUpDto`](../../../../auth/dto/signup.dto/classes/SignUpDto.md).[`role`](../../../../auth/dto/signup.dto/classes/SignUpDto.md#role)

---

### arguments

> `static` **arguments**: `any`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:305

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).arguments`

---

### caller

> `static` **caller**: `Function`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:306

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).caller`

---

### length

> `readonly` `static` **length**: `number`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:302

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).length`

---

### name

> `readonly` `static` **name**: `string`

Defined in: node_modules/typescript/lib/lib.es2015.core.d.ts:97

Returns the name of the function. Function names are read-only and can not be changed.

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).name`

## Methods

### \[hasInstance\]()

> `static` **\[hasInstance\]**(`value`): `boolean`

Defined in: node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:164

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

#### Parameters

##### value

`any`

#### Returns

`boolean`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).[hasInstance]`

---

### apply()

> `static` **apply**(`this`, `thisArg`, `argArray?`): `any`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:281

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

#### Parameters

##### this

`Function`

##### thisArg

`any`

The object to be used as the this object.

##### argArray?

`any`

A set of arguments to be passed to the function.

#### Returns

`any`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).apply`

---

### bind()

> `static` **bind**(`this`, `thisArg`, ...`argArray`): `any`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:296

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

#### Parameters

##### this

`Function`

##### thisArg

`any`

An object to which the this keyword can refer inside the new function.

##### argArray

...`any`[]

A list of arguments to be passed to the new function.

#### Returns

`any`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).bind`

---

### call()

> `static` **call**(`this`, `thisArg`, ...`argArray`): `any`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:288

Calls a method of an object, substituting another object for the current object.

#### Parameters

##### this

`Function`

##### thisArg

`any`

The object to be used as the current object.

##### argArray

...`any`[]

A list of arguments to be passed to the method.

#### Returns

`any`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).call`

---

### toString()

> `static` **toString**(): `string`

Defined in: node_modules/typescript/lib/lib.es5.d.ts:299

Returns a string representation of a function.

#### Returns

`string`

#### Inherited from

`OmitType(SignUpDto, ['password'] as const).toString`
