[**ai-moodler-backend v0.0.1**](../../../../README.md)

---

[ai-moodler-backend](../../../../README.md) / [common/interceptors/performance.interceptor](../README.md) / PerformanceInterceptor

# Class: PerformanceInterceptor

Defined in: [src/common/interceptors/performance.interceptor.ts:12](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/interceptors/performance.interceptor.ts#L12)

## Implements

- `NestInterceptor`

## Constructors

### Constructor

> **new PerformanceInterceptor**(): `PerformanceInterceptor`

#### Returns

`PerformanceInterceptor`

## Methods

### intercept()

> **intercept**(`context`, `next`): `Observable`\<`any`\>

Defined in: [src/common/interceptors/performance.interceptor.ts:15](https://github.com/Progambler227788/AI-Moodler-Backend/blob/9e2761c5a2364787580718d972a0a562e93ec1e3/src/common/interceptors/performance.interceptor.ts#L15)

Method to implement a custom interceptor.

#### Parameters

##### context

`ExecutionContext`

an `ExecutionContext` object providing methods to access the
route handler and class about to be invoked.

##### next

`CallHandler`

a reference to the `CallHandler`, which provides access to an
`Observable` representing the response stream from the route handler.

#### Returns

`Observable`\<`any`\>

#### Implementation of

`NestInterceptor.intercept`
