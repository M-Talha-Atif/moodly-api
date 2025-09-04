[**ai-moodler-backend v0.0.1**](../../../../README.md)

***

[ai-moodler-backend](../../../../README.md) / [common/services/transaction.service](../README.md) / TransactionService

# Class: TransactionService

Defined in: [src/common/services/transaction.service.ts:5](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/services/transaction.service.ts#L5)

## Constructors

### Constructor

> **new TransactionService**(`dataSource`): `TransactionService`

Defined in: [src/common/services/transaction.service.ts:6](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/services/transaction.service.ts#L6)

#### Parameters

##### dataSource

`DataSource`

#### Returns

`TransactionService`

## Methods

### withSerializableTransaction()

> **withSerializableTransaction**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/common/services/transaction.service.ts:35](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/services/transaction.service.ts#L35)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`manager`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>

***

### withTransaction()

> **withTransaction**\<`T`\>(`fn`): `Promise`\<`T`\>

Defined in: [src/common/services/transaction.service.ts:8](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/services/transaction.service.ts#L8)

#### Type Parameters

##### T

`T`

#### Parameters

##### fn

(`manager`) => `Promise`\<`T`\>

#### Returns

`Promise`\<`T`\>
