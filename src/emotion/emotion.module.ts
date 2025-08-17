import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

import {
  EmotionalProfile,
  EmotionalProfileSchema,
} from './schemas/emotional-profile.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([
      { name: EmotionalProfile.name, schema: EmotionalProfileSchema },
    ]),
    MulterModule.register({
      dest: './uploads',
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
