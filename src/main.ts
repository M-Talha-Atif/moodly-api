import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file'; // for daily log rotation
import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';

/**
 * --------------------------------
 * Safe stringify helper
 * --------------------------------
 * Ensures that values are logged as strings without
 * triggering ESLint `no-base-to-string` violations.
 */
function safeToString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

async function bootstrap() {
  /**
   * -----------------------------
   * Setup Winston Transports
   * -----------------------------
   */
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const transports: winston.transport[] = [
    // Console logs (colorized + timestamp)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          const timestamp = safeToString(info.timestamp, '');
          const level = safeToString(info.level, 'info');
          const context = info.context
            ? safeToString(info.context, 'App')
            : 'App';
          const message = safeToString(info.message, '');

          return `${timestamp} [${context}] ${level}: ${message}`;
        }),
      ),
    }),

    // Daily rotated file logs
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];

  /**
   * -----------------------------
   * Create NestJS app with Winston logger
   * -----------------------------
   */
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ transports }),
  });

  /**
   * -----------------------------
   * Setup Morgan (HTTP request logs)
   * -----------------------------
   */
  const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' },
  );

  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('dev'));

  /**
   * -----------------------------
   * Start Application
   * -----------------------------
   */
  const port = process.env.PORT || 3000;
  await app.listen(port);

  const logger = new Logger('Bootstrap');
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
