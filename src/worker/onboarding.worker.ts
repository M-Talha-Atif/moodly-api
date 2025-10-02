// src/worker/onboarding.worker.ts
import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { UsersService } from 'src/users/users.service';

@Controller()
export class OnboardingWorker {
  private readonly logger = new Logger(OnboardingWorker.name);

  constructor(private readonly usersService: UsersService) {}

  @EventPattern(RMQ_DOMAINS.ONBOARDING.ROUTING.COMPLETED)
  async handleOnboardingCompleted(@Payload() data: { userId: string }) {
    this.logger.log(`✅ Onboarding completed for user ${data.userId}`);

    await this.usersService.update(data.userId, {
      onboardingCompleted: true,
    });
  }
}
