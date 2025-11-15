// src/host-onboarding/host-onboarding.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { HostOnboardingService } from '../service/host-onboarding.service';
import {
  AnswerQuestionDto,
  SetGoalsDto,
  SetActivitiesDto,
} from 'src/onboarding/dto/onboarding.dto';
import { ResultDto } from 'src/common/dto/result.dto';

@ApiTags('Host Onboarding')
@ApiBearerAuth()
@UseGuards(JwtCookieGuard)
@Controller('host/onboarding')
export class HostOnboardingController {
  constructor(private readonly hostOnboardingService: HostOnboardingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start host onboarding process' })
  async start(@Req() req: any) {
    const profile = await this.hostOnboardingService.startOnboarding(
      req.user.sub,
    );
    return ResultDto.ok(profile, 'Host onboarding started');
  }

  @Post('answer')
  @ApiOperation({ summary: 'Answer a single host onboarding question' })
  async answer(@Req() req: any, @Body() dto: AnswerQuestionDto) {
    const updated = await this.hostOnboardingService.answerQuestion(
      req.user.sub,
      dto,
    );
    return ResultDto.ok(updated, 'Answer saved');
  }

  @Post('goals')
  @ApiOperation({ summary: 'Set host goals' })
  async goals(@Req() req: any, @Body() dto: SetGoalsDto) {
    const updated = await this.hostOnboardingService.setGoals(
      req.user.sub,
      dto,
    );
    return ResultDto.ok(updated, 'Goals updated');
  }

  @Post('activities')
  @ApiOperation({ summary: 'Set host activities' })
  async activities(@Req() req: any, @Body() dto: SetActivitiesDto) {
    const updated = await this.hostOnboardingService.setActivities(
      req.user.sub,
      dto,
    );
    return ResultDto.ok(updated, 'Activities updated');
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete host onboarding process' })
  async complete(@Req() req: any) {
    const profile = await this.hostOnboardingService.complete(req.user.sub);
    return ResultDto.ok(profile, 'Host onboarding completed');
  }

  @Get('status')
  @ApiOperation({ summary: 'Check host onboarding status' })
  async status(@Req() req: any) {
    const status = await this.hostOnboardingService.getStatus(req.user.sub);
    return ResultDto.ok(status, 'Host onboarding status retrieved');
  }
}
