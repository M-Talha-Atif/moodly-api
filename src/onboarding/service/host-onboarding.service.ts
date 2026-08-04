import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HostOnboarding } from 'src/onboarding/schemas/host-onboarding.schema';
import {
  AnswerQuestionDto,
  SetGoalsDto,
  SetActivitiesDto,
} from 'src/onboarding/dto/onboarding.dto';
import { RMQ_DOMAINS } from 'src/infra/config/rmq.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class HostOnboardingService {
  constructor(
    @InjectModel(HostOnboarding.name)
    private model: Model<HostOnboarding>,

    @Inject(RMQ_DOMAINS.ONBOARDING.CLIENT)
    private readonly rmqClient: ClientProxy,
  ) {}

  async startOnboarding(hostId: string): Promise<HostOnboarding> {
    return this.model.findOneAndUpdate(
      { hostId },
      {
        $setOnInsert: {
          responses: [],
          goals: [],
          activities: [],
          currentStep: 0,
          completed: false,
        },
      },
      { new: true, upsert: true },
    );
  }

  async answerQuestion(hostId: string, dto: AnswerQuestionDto) {
    const profile = await this.findByHostId(hostId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.responses.push(dto);
    profile.currentStep += 1;

    return profile.save();
  }

  async setGoals(hostId: string, dto: SetGoalsDto) {
    const profile = await this.findByHostId(hostId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.goals = dto.goals;
    profile.currentStep += 1;

    return profile.save();
  }

  async setActivities(hostId: string, dto: SetActivitiesDto) {
    const profile = await this.findByHostId(hostId);
    if (!profile) throw new BadRequestException('Onboarding not started');

    profile.activities = dto.activities;
    profile.currentStep += 1;

    return profile.save();
  }

  async complete(hostId: string) {
    const profile = await this.model.findOneAndUpdate(
      { hostId },
      { completed: true },
      { new: true },
    );

    this.rmqClient.emit(RMQ_DOMAINS.ONBOARDING.ROUTING.COMPLETED, {
      hostId,
    });

    return profile;
  }

  async findByHostId(hostId: string) {
    return this.model.findOne({ hostId });
  }

  async getStatus(hostId: string) {
    const profile = await this.findByHostId(hostId);
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
