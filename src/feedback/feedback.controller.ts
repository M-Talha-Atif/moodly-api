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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtCookieGuard } from '../auth/guards/jwt-cookie.guard';
import { PendingFeedbackService } from './pending-feedback.service';
import { ResultDto } from 'src/common/dto/result.dto';

@ApiTags('Feedback')
@ApiBearerAuth()
@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly pendingFeedbackService: PendingFeedbackService,
  ) {}

  @UseGuards(JwtCookieGuard)
  @Post(':experienceId')
  @ApiOperation({ summary: 'Create feedback for an experience' })
  @ApiParam({
    name: 'experienceId',
    description: 'ID of the experience to attach feedback',
    example: '64f4eac12345b2cde6789f01',
  })
  @ApiResponse({
    status: 201,
    description: 'Feedback created successfully',
    type: ResultDto,
  })
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
  @ApiOperation({ summary: 'Get all feedback for a given experience' })
  @ApiParam({
    name: 'experienceId',
    description: 'ID of the experience',
    example: '64f4eac12345b2cde6789f01',
  })
  @ApiResponse({
    status: 200,
    description: 'Feedback fetched successfully',
    type: ResultDto,
  })
  async getAll(@Param('experienceId') experienceId: string) {
    const feedbacks =
      await this.feedbackService.findAllForExperience(experienceId);
    return ResultDto.ok(feedbacks, 'Feedback fetched successfully');
  }

  @UseGuards(JwtCookieGuard)
  @Get('pending')
  @ApiOperation({ summary: 'Get pending feedback for current user' })
  @ApiResponse({
    status: 200,
    description: 'List of pending feedback',
    type: ResultDto,
  })
  async getPending(@Req() req) {
    const pending = await this.pendingFeedbackService.findForUser(req.user.sub);
    return ResultDto.ok(pending, 'Pending feedbacks');
  }

  @UseGuards(JwtCookieGuard)
  @Delete('pending/:id')
  @ApiOperation({ summary: 'Remove a pending feedback item' })
  @ApiParam({
    name: 'id',
    description: 'Pending feedback ID',
    example: '650123abc456def789ghi012',
  })
  @ApiResponse({
    status: 200,
    description: 'Pending feedback removed',
    type: ResultDto,
  })
  async removePending(@Req() req, @Param('id') id: string) {
    await this.pendingFeedbackService.deleteById(req.user.sub, id);
    return ResultDto.okEmpty();
  }
}
