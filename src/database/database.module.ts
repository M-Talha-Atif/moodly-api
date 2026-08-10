import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';
        return {
          type: 'postgres',
          host: config.get<string>('POSTGRES_HOST'),
          port: parseInt(config.get<string>('POSTGRES_PORT') || '5432', 10),
          username: config.get<string>('POSTGRES_USER'),
          password: config.get<string>('POSTGRES_PASSWORD'),
          database: config.get<string>('POSTGRES_DB'),
          entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: true,
          logger: 'advanced-console',
          // Matches src/database/data-source.ts: provider-agnostic SSL rather than a
          // hardcoded CA, since the Postgres host varies by environment (RDS, Neon, etc.).
          ssl: isProd ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: config.get<string>('MONGO_DB'),
      }),
    }),
  ],
})
export class DatabaseModule {}
