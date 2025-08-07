// src/feedback/feedback.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @UseGuards(JwtCookieGuard)
  @Post(':experienceId')
  create(
    @Param('experienceId') experienceId: string,
    @Body() dto: CreateFeedbackDto,
    @Req() req,
  ) {
    return this.feedbackService.create(dto, req.user, experienceId);
  }

  @Get('/experience/:experienceId')
  getAll(@Param('experienceId') experienceId: string) {
    return this.feedbackService.findAllForExperience(experienceId);
  }
}
