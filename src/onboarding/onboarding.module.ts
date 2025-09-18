// src/onboarding/onboarding.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import {
  UserOnboarding,
  UserOnboardingSchema,
} from './schemas/user-onboarding.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserOnboarding.name, schema: UserOnboardingSchema },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('UPLOADS_DIR') || './uploads',
        limits: { fileSize: 5 * 1024 * 1024 },
      }),
    }),
    AuthModule,
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService],
  exports: [OnboardingService],
})
export class OnboardingModule {}
