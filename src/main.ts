import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupBullBoard } from './bull-board/bull-board';
import { Queue } from 'bullmq';
import { DiagramService } from './diagram/diagram.service';
import { ValidationPipe } from '@nestjs/common';

/**
 * --------------------------------
 * Safe stringify helper
 * --------------------------------
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
  // -----------------------------
  // Setup Winston Transports
  // -----------------------------
  const logDir = path.join(__dirname, '..', 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const transports: winston.transport[] = [
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

  // -----------------------------
  // Create Nest app with Winston logger
  // -----------------------------
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ transports }),
  });

  // -----------------------------
  // CORS + Cookie parser
  // -----------------------------
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.use(cookieParser());

  // -----------------------------
  // Morgan HTTP logging
  // -----------------------------
  const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' },
  );
  app.use(morgan('combined', { stream: accessLogStream }));
  app.use(morgan('dev'));

  // -----------------------------
  // Swagger setup
  // -----------------------------
  const config = new DocumentBuilder()
    .setTitle('My API Docs')
    .setDescription('NestJS REST API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // -----------------------------
  // Bull queues + Bull Board

  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
  }

  const redisConnection = {
    connection: {
      url: process.env.REDIS_URL,
    },
  };

  const moodQueue = new Queue('mood-queue', redisConnection);
  const recommendationQueue = new Queue(
    'recommendation-queue',
    redisConnection,
  );
  const notificationQueue = new Queue('notification-queue', redisConnection);
  // // -----------------------------
  // const moodQueue = new Queue('mood-queue', {
  //   connection: { host: 'localhost', port: 6379 },
  // });
  // const recommendationQueue = new Queue('recommendation-queue', {
  //   connection: { host: 'localhost', port: 6379 },
  // });
  // const notificationQueue = new Queue('notification-queue', {
  //   connection: { host: 'localhost', port: 6379 },
  // });

  const bullBoardAdapter = setupBullBoard([
    moodQueue,
    recommendationQueue,
    notificationQueue,
  ]);
  const expressInstance = app.getHttpAdapter().getInstance();
  expressInstance.use('/admin/queues', bullBoardAdapter.getRouter());

  // -----------------------------
  // Diagram service setup
  // -----------------------------
  const diagramService = app.get(DiagramService);
  diagramService.setApp(app);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // -----------------------------
  // Start server
  // -----------------------------
  const port = process.env.PORT || 3002;
  // await app.listen(port);
  await app.listen(port); // public access

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger docs available at: http://localhost:${port}/api-docs`);
  logger.log(`Bull Board available at: http://localhost:${port}/admin/queues`);
}

bootstrap();
