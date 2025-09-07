[**ai-moodler-backend v0.0.1**](../../../README.md)

---

[ai-moodler-backend](../../../README.md) / [redis/redis.service](../README.md) / RedisService

# Class: RedisService

Defined in: [src/redis/redis.service.ts:5](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L5)

## Constructors

### Constructor

> **new RedisService**(): `RedisService`

Defined in: [src/redis/redis.service.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L8)

#### Returns

`RedisService`

## Methods

### acquireLock()

> **acquireLock**(`key`, `ttl`): `Promise`\<`null` \| `string`\>

Defined in: [src/redis/redis.service.ts:76](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L76)

#### Parameters

##### key

`string`

##### ttl

`number`

#### Returns

`Promise`\<`null` \| `string`\>

---

### del()

> **del**(`key`): `Promise`\<`void`\>

Defined in: [src/redis/redis.service.ts:72](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L72)

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`void`\>

---

### get()

> **get**\<`T`\>(`key`): `Promise`\<`null` \| `T`\>

Defined in: [src/redis/redis.service.ts:66](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L66)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

#### Returns

`Promise`\<`null` \| `T`\>

---

### onModuleInit()

> **onModuleInit**(): `Promise`\<`void`\>

Defined in: [src/redis/redis.service.ts:29](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L29)

#### Returns

`Promise`\<`void`\>

---

### releaseLock()

> **releaseLock**(`key`, `lock`): `Promise`\<`void`\>

Defined in: [src/redis/redis.service.ts:82](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L82)

#### Parameters

##### key

`string`

##### lock

`string`

#### Returns

`Promise`\<`void`\>

---

### set()

> **set**\<`T`\>(`key`, `value`, `ttlSeconds?`): `Promise`\<`void`\>

Defined in: [src/redis/redis.service.ts:56](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/redis/redis.service.ts#L56)

#### Type Parameters

##### T

`T`

#### Parameters

##### key

`string`

##### value

`T`

##### ttlSeconds?

`number`

#### Returns

`Promise`\<`void`\>
