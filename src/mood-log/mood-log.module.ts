import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { MoodLog } from './entities/mood-log.entity';
import { MoodLogService } from './mood-log.service';
import { MoodLogController } from './mood-log.controller';
import { EmbeddingModule } from 'src/embedding/embedding.module';
import { MoodLogEmbedding, MoodLogEmbeddingSchema } from 'src/embedding/schemas/moodlog-embedding.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([MoodLog]),
    MongooseModule.forFeature([
      { name: MoodLogEmbedding.name, schema: MoodLogEmbeddingSchema },
    ]),
    EmbeddingModule,
  ],
  controllers: [MoodLogController],
  providers: [MoodLogService],
  exports: [MoodLogService],
})
export class MoodLogModule {}
