import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmotionalProfile } from './schemas/emotional-profile.schema';

@Injectable()
export class EmotionService {
  constructor(
    @InjectModel(EmotionalProfile.name) private model: Model<EmotionalProfile>,
  ) {}

  async create(userId: string, data: any): Promise<EmotionalProfile> {
    const existing = await this.findByUserId(userId);
    if (existing) {
      throw new BadRequestException('Emotional profile already exists');
    }
    return this.model.create({ userId, ...data });
  }

  async findByUserId(userId: string): Promise<EmotionalProfile | null> {
    return this.model.findOne({ userId });
  }

  async update(userId: string, data: any): Promise<EmotionalProfile | null> {
    return this.model.findOneAndUpdate({ userId }, data, {
      new: true,
      runValidators: true,
    });
  }
}
