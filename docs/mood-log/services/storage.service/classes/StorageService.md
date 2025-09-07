[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [mood-log/services/storage.service](../README.md) / StorageService

# Class: StorageService

Defined in: [src/mood-log/services/storage.service.ts:7](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/storage.service.ts#L7)

## Constructors

### Constructor

> **new StorageService**(): `StorageService`

#### Returns

`StorageService`

## Methods

### delete()

> **delete**(`filePath`): `Promise`\<`void`\>

Defined in: [src/mood-log/services/storage.service.ts:24](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/storage.service.ts#L24)

#### Parameters

##### filePath

`string`

#### Returns

`Promise`\<`void`\>

---

### getPublicUrl()

> **getPublicUrl**(`filePath`): `string`

Defined in: [src/mood-log/services/storage.service.ts:33](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/storage.service.ts#L33)

#### Parameters

##### filePath

`string`

#### Returns

`string`

---

### save()

> **save**(`file`, `type`): `Promise`\<`string`\>

Defined in: [src/mood-log/services/storage.service.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/mood-log/services/storage.service.ts#L10)

#### Parameters

##### file

`File`

##### type

`"voice"` | `"photo"`

#### Returns

`Promise`\<`string`\>
