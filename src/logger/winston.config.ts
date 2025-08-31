import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { getRequestId } from './als';

const baseJson = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format((info) => {
    const rid = getRequestId();
    if (rid) info.requestId = rid;
    return info;
  })(),
  winston.format.json(),
);

export const buildWinstonOptions = (
  service = 'api',
): winston.LoggerOptions => ({
  level: process.env.LOG_LEVEL || 'info',
  defaultMeta: { service },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ level, message, timestamp, requestId, ...meta }) =>
            `${timestamp} ${level} ${requestId ? `[${requestId}] ` : ''}${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`,
        ),
      ),
    }),
    new DailyRotateFile({
      dirname: process.env.LOG_DIR || 'logs',
      filename: `${service}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxFiles: '30d',
      maxSize: '50m',
      format: baseJson,
    }),
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
  ],
});
