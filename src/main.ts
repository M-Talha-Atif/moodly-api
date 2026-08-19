import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupBullBoard } from './infra/bull-board/bull-board';
import { Queue } from 'bullmq';
import { DiagramService } from './diagram/diagram.service';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { buildWinstonOptions } from './logger/winston.config';

async function bootstrap() {
  // -----------------------------
  // Create Nest app with Winston logger. buildWinstonOptions (src/logger/winston.config.ts)
  // is the single source of transport config (console, rotating files, Loki when
  // configured), shared with the WinstonModule.forRoot(...) registered in AppModule so the
  // bootstrap logger and the DI-injected one (used by LoggingInterceptor) behave identically.
  // -----------------------------
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(buildWinstonOptions('api')),
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
  // API versioning: every route becomes /v1/... unless it opts out with
  // VERSION_NEUTRAL (see AppController). Must run before Swagger document
  // generation below so the generated spec reflects the versioned paths.
  // -----------------------------
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // -----------------------------
  // Morgan HTTP logging (raw access log, separate from Winston's own JSON logs)
  // -----------------------------
  const logDir = process.env.LOG_DIR || 'logs';
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
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
