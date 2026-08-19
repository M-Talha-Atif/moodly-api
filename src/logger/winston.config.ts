import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import LokiTransport from 'winston-loki';
import { getRequestId } from './als';

/**
 * -----------------------------
 * Base JSON formatter
 * -----------------------------
 * - Adds timestamp
 * - Captures stack traces
 * - Injects requestId (if exists)
 * - Outputs JSON for structured logging
 */
const baseJson = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format((info) => {
    const rid = getRequestId();
    if (rid) {
      // ✅ Ensure requestId is always a string
      info.requestId = typeof rid === 'string' ? rid : JSON.stringify(rid);
    }
    return info;
  })(),
  winston.format.json(),
);

export const buildWinstonOptions = (service = 'api'): winston.LoggerOptions => {
  const transports: winston.transport[] = [
    /**
     * -----------------------------
     * Console Transport
     * -----------------------------
     */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const { level, timestamp, requestId, message, ...meta } = info;

          // ✅ Ensure message is always a string
          const safeMessage =
            typeof message === 'string'
              ? message
              : JSON.stringify(message ?? '');

          // ✅ Fix requestId stringification
          const rid =
            requestId && typeof requestId !== 'string'
              ? JSON.stringify(requestId)
              : (requestId as string) || '';

          // ✅ Safely stringify meta
          const metaStr =
            meta && Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';

          return `${String(timestamp)} ${String(level)} ${
            rid ? `[${rid}] ` : ''
          }${safeMessage} ${metaStr}`;
        }),
      ),
    }),

    /**
     * -----------------------------
     * File Transport (All logs)
     * -----------------------------
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- winston-daily-rotate-file's default export resolves as `any` under this project's esModuleInterop setup, pre-existing, not something introduced here.
    new DailyRotateFile({
      dirname: process.env.LOG_DIR || 'logs',
      filename: `${service}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxSize: '50m',
      format: baseJson,
    }),

    /**
     * -----------------------------
     * File Transport (Errors only)
     * -----------------------------
     */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- same as above.
    new DailyRotateFile({
      dirname: process.env.LOG_DIR || 'logs',
      filename: `${service}-error-%DATE%.log`,
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '60d',
      maxSize: '50m',
      format: baseJson,
    }),
  ];

  // Ships structured logs to Grafana Cloud Loki when configured, skipped entirely
  // otherwise (local dev, or before Grafana credentials are set) rather than erroring.
  // OTEL_SERVICE_NAME takes precedence so the Loki label matches the trace/metric
  // service name from src/tracing.ts; falls back to this function's own `service` arg.
  if (process.env.LOKI_URL) {
    transports.push(
      new LokiTransport({
        host: process.env.LOKI_URL,
        basicAuth:
          process.env.LOKI_USER && process.env.LOKI_API_KEY
            ? `${process.env.LOKI_USER}:${process.env.LOKI_API_KEY}`
            : undefined,
        labels: {
          app: process.env.OTEL_SERVICE_NAME || service,
          env: process.env.NODE_ENV || 'development',
        },
        json: true,
        format: baseJson,
        replaceTimestamp: true,
        onConnectionError: (err) => console.error('Loki connection error', err),
      }),
    );
  }

  return {
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: { service },
    transports,
  };
};
