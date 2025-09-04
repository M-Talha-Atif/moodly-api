[**ai-moodler-backend v0.0.1**](../../../README.md)

***

[ai-moodler-backend](../../../README.md) / [logger/logging.interceptor](../README.md) / LoggingInterceptor

# Class: LoggingInterceptor

Defined in: [src/logger/logging.interceptor.ts:13](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/logger/logging.interceptor.ts#L13)

## Implements

- `NestInterceptor`

## Constructors

### Constructor

> **new LoggingInterceptor**(`logger`): `LoggingInterceptor`

Defined in: [src/logger/logging.interceptor.ts:14](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/logger/logging.interceptor.ts#L14)

#### Parameters

##### logger

`Logger`

#### Returns

`LoggingInterceptor`

## Methods

### intercept()

> **intercept**(`ctx`, `next`): `Observable`\<`any`\>

Defined in: [src/logger/logging.interceptor.ts:17](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/logger/logging.interceptor.ts#L17)

Method to implement a custom interceptor.

#### Parameters

##### ctx

`ExecutionContext`

##### next

`CallHandler`

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Observable`\<`any`\>

#### Implementation of

`NestInterceptor.intercept`
