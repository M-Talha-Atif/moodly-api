import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmotionService } from './emotion.service';
import { EmotionController } from './emotion.controller';
import {
  EmotionalProfile,
  EmotionalProfileSchema,
} from './schemas/emotional-profile.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmotionalProfile.name, schema: EmotionalProfileSchema },
    ]),
  ],
  controllers: [EmotionController],
  providers: [EmotionService],
})
export class EmotionModule {}
