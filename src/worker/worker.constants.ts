// HTTP port the worker process listens on (health-check only, no real controllers).
// Falls back to 3001 for local/docker-compose use; platforms like Render inject their
// own PORT and expect the app to bind to it rather than a fixed port.
export const WORKER_HTTP_PORT = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : 3001;

// Applied identically to all 5 RabbitMQ domain connections: process one message at a time
// per domain before acking the next, trading throughput for simpler ordering/backpressure.
export const WORKER_PREFETCH_COUNT = 1;
