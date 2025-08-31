import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file'; // for daily log rotation
import morgan from 'morgan'; 
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  /**
   * -----------------------------
   * Setup Winston Transports
   * -----------------------------
   * - Console: Shows logs in terminal (colorized).
   * - Daily Rotate File: Saves logs in /logs/app-%DATE%.log.
   *   Keeps logs rotated daily.
   */
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${context || 'App'}] ${level}: ${message}`,
        ),
      ),
    }),
    new winston.transports.DailyRotateFile({
      dirname: logDir,
      filename: 'app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d', // keep logs for 14 days
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ];

  /**
   * -----------------------------
   * Create NestJS app with Winston Logger
   * -----------------------------
   */
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ transports }),
  });

  /**
   * -----------------------------
   * Setup Morgan (HTTP Request Logger)
   * -----------------------------
   * - Logs all HTTP requests in "combined" format.
   * - Writes logs into /logs/access.log file.
   */
  const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }, // append mode
  );
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('dev')); // pretty logs in console

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
