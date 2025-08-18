import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import express from 'express';
import { setupBullBoard } from './bull-board/bull-board';
import { Queue } from 'bullmq';
import { DiagramService } from './diagram/diagram.service';

async function bootstrap() {
  const envPath = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error(`.env file not found at: ${envPath}`);
    process.exit(1);
  }

  const envConfig = dotenv.config({ path: envPath });
  if (envConfig.error) {
    console.error('Failed to load .env:', envConfig.error);
    process.exit(1);
  }

  const requiredVars = [
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'JWT_SECRET',
  ];

  const missingVars = requiredVars.filter((v) => !process.env[v]);
  if (missingVars.length) {
    console.error('Missing required environment variables:', missingVars);
    process.exit(1);
  }

  const app = await NestFactory.create(AppModule);

  const diagramService = app.get(DiagramService);
  diagramService.setApp(app);

  const diagrams = diagramService.getModuleDiagrams();

  // console.log('Core Diagram:\n', diagrams.core);
  // console.log('Business Diagram:\n', diagrams.business);
  // console.log('Queues Diagram:\n', diagrams.queues);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.use(cookieParser());

  // === BULLMQ QUEUE + BULL BOARD SETUP ===

  const moodQueue = new Queue('mood-queue', {
    connection: { host: 'localhost', port: 6379 },
  });

  const recommendationQueue = new Queue('recommendation-queue', {
    connection: { host: 'localhost', port: 6379 },
  });

  const notificationQueue = new Queue('notification-queue', {
    connection: { host: 'localhost', port: 6379 },
  });

  const expressServer = express();
  const bullBoardAdapter = setupBullBoard([
    moodQueue,
    recommendationQueue,
    notificationQueue,
  ]);
  expressServer.use('/admin/queues', bullBoardAdapter.getRouter());

  // Mount Express server inside Nest app
  app.use(expressServer);

  // Start server
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 App running at http://localhost:${port}`);
  console.log(
    `🔧 Bull Board available at http://localhost:${port}/admin/queues`,
  );
}
bootstrap();
