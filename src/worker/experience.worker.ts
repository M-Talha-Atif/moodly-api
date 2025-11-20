import { Controller, Logger, Inject } from '@nestjs/common';
import { EventPattern, Payload, ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../experience/entities/experience.entity';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { AiExperienceService } from 'src/experience/services/host/ai-experience.service';

type ExperienceAIPayload = {
  experienceId: string;
};

@Controller()
export class ExperienceWorker {
  private readonly logger = new Logger(ExperienceWorker.name);

  constructor(
    @InjectRepository(Experience)
    private readonly repo: Repository<Experience>,
    private readonly aiService: AiExperienceService,
    @Inject(RMQ_DOMAINS.EXPERIENCE.CLIENT)
    private readonly rmqClient: ClientProxy,
  ) {}

  @EventPattern(RMQ_DOMAINS.EXPERIENCE.ROUTING.GENERATE_AI)
  async handleGenerateAI(@Payload() payload: ExperienceAIPayload) {
    this.logger.debug(
      `Generating AI fields for experience ${payload.experienceId}`,
    );

    const experience = await this.repo.findOne({
      where: { id: payload.experienceId },
    });
    if (!experience) {
      this.logger.warn(`Experience ${payload.experienceId} not found`);
      return;
    }

    // Call AI/Gemini service
    const aiResult = await this.aiService.generateExperienceFields(experience);

    // Update experience
    Object.assign(experience, aiResult);
    await this.repo.save(experience);

    this.logger.debug(
      `Experience ${payload.experienceId} updated with AI fields`,
    );
  }
}
