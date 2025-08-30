// src/onboarding/onboarding.controller.ts
import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import { OnboardingService } from './onboarding.service';
import {
  AnswerQuestionDto,
  SetGoalsDto,
  SetActivitiesDto,
} from './dto/onboarding.dto';
import { ResultDto } from '../common/dto/result.dto';

@ApiTags('Onboarding')
@ApiBearerAuth()
@UseGuards(JwtCookieGuard)
@Controller('onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start onboarding process' })
  async start(@Req() req: any) {
    const profile = await this.onboardingService.startOnboarding(req.user.sub);
    return ResultDto.ok(profile, 'Onboarding started');
  }

  @Post('answer')
  @ApiOperation({ summary: 'Answer a single onboarding question' })
  async answer(@Req() req: any, @Body() dto: AnswerQuestionDto) {
    const updated = await this.onboardingService.answerQuestion(
      req.user.sub,
      dto,
    );
    return ResultDto.ok(updated, 'Answer saved');
  }

  @Post('goals')
  @ApiOperation({ summary: 'Set user goals' })
  async goals(@Req() req: any, @Body() dto: SetGoalsDto) {
    const updated = await this.onboardingService.setGoals(req.user.sub, dto);
    return ResultDto.ok(updated, 'Goals updated');
  }

  @Post('activities')
  @ApiOperation({ summary: 'Set user activities' })
  async activities(@Req() req: any, @Body() dto: SetActivitiesDto) {
    const updated = await this.onboardingService.setActivities(
      req.user.sub,
      dto,
    );
    return ResultDto.ok(updated, 'Activities updated');
  }

  @Post('complete')
  @ApiOperation({ summary: 'Complete onboarding process' })
  async complete(@Req() req: any) {
    const profile = await this.onboardingService.complete(req.user.sub);
    return ResultDto.ok(profile, 'Onboarding completed');
  }

  @Get('status')
  @ApiOperation({ summary: 'Check onboarding status' })
  async status(@Req() req: any) {
    const status = await this.onboardingService.getStatus(req.user.sub);
    return ResultDto.ok(status, 'Onboarding status retrieved');
  }
}
