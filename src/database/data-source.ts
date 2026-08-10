// src/database/data-source.ts
import { DataSource } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isProd = process.env.NODE_ENV === 'production';
const root = isProd
  ? path.resolve(__dirname, '../../dist')
  : path.resolve(__dirname, '..');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [
    // in dev: src/**/entities/*.entity.ts, in prod: dist/**/entities/*.entity.js
    path.resolve(root, '**', 'entities', '**', '*.entity.{ts,js}'),
  ],
  migrations: [
    // in dev: src/...ts  in prod: dist/...js
    path.resolve(root, '**', 'migrations', '*.{ts,js}'),
  ],
  // "each" (rather than the default "all") is required for AddBookingExperienceIndexes's
  // per-migration `transaction = false` override to be allowed at all: TypeORM rejects any
  // migration overriding the transaction mode while the global mode is "all".
  migrationsTransactionMode: 'each',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});
