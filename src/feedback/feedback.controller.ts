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

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly pendingFeedbackService: PendingFeedbackService,
  ) {}

  @UseGuards(JwtCookieGuard)
  @Post(':experienceId')
  create(
    @Param('experienceId') experienceId: string,
    @Body() dto: CreateFeedbackDto,
    @Req() req,
  ) {
    // req.user is complete payload of the JWT token
    // sub is id, role of user,
    /* 
    {
  "sub": "d1ad7c62-5a7e-4e5e-bb1c-4a2f3c3a5b4a",
  "email": "example@mail.com",
  "role": "user",
  "iat": 1691495432,
  "exp": 1691499032
}
    */
    return this.feedbackService.create(dto, req.user.sub, experienceId);
  }

  @Get('/experience/:experienceId')
  getAll(@Param('experienceId') experienceId: string) {
    return this.feedbackService.findAllForExperience(experienceId);
  }

  @Get('pending')
  async getPending(@Req() req) {
    return this.pendingFeedbackService.findForUser(req.user.sub);
  }

  @Delete('pending/:id')
  async removePending(@Param('id') id: string) {
    const result = await this.pendingFeedbackService.delete(id);
    return result;
  }
}
