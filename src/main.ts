import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';

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
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
