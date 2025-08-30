// src/onboarding/onboarding.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserOnboarding } from './schemas/user-onboarding.schema';
import {
  AnswerQuestionDto,
  SetGoalsDto,
  SetActivitiesDto,
} from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(UserOnboarding.name)
    private model: Model<UserOnboarding>,
  ) {}

  async startOnboarding(userId: string): Promise<UserOnboarding> {
    return this.model.findOneAndUpdate(
      { userId }, // search by userId
      {
        $setOnInsert: {
          responses: [],
          goals: [],
          activities: [],
          currentStep: 0,
          completed: false,
        },
      },
      { new: true, upsert: true }, // create if not exists
    );
  }

  async answerQuestion(userId: string, dto: AnswerQuestionDto) {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.responses.push(dto);
    profile.currentStep += 1;

    return profile.save();
  }

  async setGoals(userId: string, dto: SetGoalsDto) {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.goals = dto.goals;
    profile.currentStep += 1; // increment step
    return profile.save();
  }

  async setActivities(userId: string, dto: SetActivitiesDto) {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.activities = dto.activities;
    profile.currentStep += 1; // increment step
    return profile.save();
  }

  async complete(userId: string) {
    return this.model.findOneAndUpdate(
      { userId },
      { completed: true },
      { new: true },
    );
  }

  async findByUserId(userId: string) {
    return this.model.findOne({ userId });
  }

  async getStatus(userId: string) {
    const profile = await this.findByUserId(userId);
    if (!profile) return { started: false };

    return {
      started: true,
      currentStep: profile.currentStep,
      completed: profile.completed,
      goals: profile.goals,
      activities: profile.activities,
    };
  }
}
