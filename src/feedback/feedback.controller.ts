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
  constructor(private readonly feedbackService: FeedbackService) { }

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
}
