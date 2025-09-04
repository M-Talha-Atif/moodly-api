[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [common/roles.guard](../README.md) / RolesGuard

# Class: RolesGuard

Defined in: [src/common/roles.guard.ts:10](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/roles.guard.ts#L10)

## Implements

- `CanActivate`

## Constructors

### Constructor

> **new RolesGuard**(`reflector`): `RolesGuard`

Defined in: [src/common/roles.guard.ts:11](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/roles.guard.ts#L11)

#### Parameters

##### reflector

`Reflector`

#### Returns

`RolesGuard`

## Methods

### canActivate()

> **canActivate**(`context`): `boolean`

Defined in: [src/common/roles.guard.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/roles.guard.ts#L13)

#### Parameters

##### context

`ExecutionContext`

Current execution context. Provides access to details about
the current request pipeline.

#### Returns

`boolean`

Value indicating whether or not the current request is allowed to
proceed.

#### Implementation of

`CanActivate.canActivate`
