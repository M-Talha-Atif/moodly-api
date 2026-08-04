// HTTP port the worker process listens on (health-check only, no real controllers).
export const WORKER_HTTP_PORT = 3001;

// Applied identically to all 5 RabbitMQ domain connections: process one message at a time
// per domain before acking the next, trading throughput for simpler ordering/backpressure.
export const WORKER_PREFETCH_COUNT = 1;
