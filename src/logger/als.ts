import { AsyncLocalStorage } from 'node:async_hooks';
export const als = new AsyncLocalStorage<{ requestId: string }>();
export const getRequestId = () => als.getStore()?.requestId;
