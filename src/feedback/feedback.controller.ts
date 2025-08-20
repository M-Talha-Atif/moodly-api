// src/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';

import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { PendingFeedbackService } from './pending-feedback.service';
import { ResultDto } from 'src/common/dto/result.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly pendingFeedbackService: PendingFeedbackService,
  ) {}
  @UseGuards(JwtCookieGuard)
  @Post(':experienceId')
  async create(
    @Param('experienceId') experienceId: string,
    @Body() dto: CreateFeedbackDto,
    @Req() req,
  ) {
    const feedback = await this.feedbackService.create(
      dto,
      req.user.sub,
      experienceId,
    );
    return ResultDto.ok(feedback, 'Feedback created successfully');
  }

  @UseGuards(JwtCookieGuard)
  @Get('/experience/:experienceId')
  async getAll(@Param('experienceId') experienceId: string) {
    const feedbacks =
      await this.feedbackService.findAllForExperience(experienceId);
    return ResultDto.ok(feedbacks, 'Feedback fetched successfully');
  }

  @UseGuards(JwtCookieGuard)
  @Get('pending')
  async getPending(@Req() req) {
    const pending = await this.pendingFeedbackService.findForUser(req.user.sub);
    return ResultDto.ok(pending, 'Pending feedbacks');
  }

  @UseGuards(JwtCookieGuard)
  @Delete('pending/:id')
  async removePending(@Req() req, @Param('id') id: string) {
    await this.pendingFeedbackService.deleteById(req.user.sub, id);
    return ResultDto.okEmpty();
  }
}
