import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

@Module({
  imports: [
    // PostgreSQL/TypeORM configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
        synchronize: configService.get('NODE_ENV') !== 'production',
        // synchronize: false, // <-- force OFF for pgvector
        logging: true,
        logger: 'advanced-console',
      }),
      inject: [ConfigService],
    }),
    // MongoDB/Mongoose configuration
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
        // Optional Mongoose settings
        dbName: configService.get('MONGO_DB'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '../../.env'),
    }),
  ],
})
export class DatabaseModule {}
