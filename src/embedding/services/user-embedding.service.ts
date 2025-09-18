// src/embedding/user-embedding.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoodLogEmbedding } from '../schemas/moodlog-embedding.schema';

@Injectable()
export class UserEmbeddingService {
  constructor(
    @InjectModel(MoodLogEmbedding.name)
    private readonly moodLogEmbeddingModel: Model<MoodLogEmbedding>,
  ) {}

  async getLatestUserEmbedding(userId: string): Promise<number[] | null> {
    try {
      const latestLog = await this.moodLogEmbeddingModel
        .findOne({ userId })
        .sort({ createdAt: -1 })
        .lean();

      return latestLog?.embedding || null;
    } catch (err) {
      console.error('Error fetching embedding:', err);
      throw new InternalServerErrorException('Failed to fetch user embedding');
    }
  }
}
