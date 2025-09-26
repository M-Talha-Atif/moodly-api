import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Query,
  HttpException,
  InternalServerErrorException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { MoodLogService } from './services/mood-log.service';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResultDto } from 'src/common/dto/result.dto';

@ApiTags('Mood Log')
@ApiBearerAuth()
@Controller('mood-log')
export class MoodLogController {
  constructor(private readonly moodLogService: MoodLogService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new mood log with optional photo/voice' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Mood log data with optional media uploads',
    type: CreateMoodLogDto,
  })
  @ApiResponse({ status: 201, description: 'Mood log created successfully' })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
      { name: 'voice', maxCount: 1 },
    ]),
  )
  async create(
    @UploadedFiles()
    files: { photo?: Express.Multer.File[]; voice?: Express.Multer.File[] },
    @Body() body: CreateMoodLogDto,
    @Req() req: any,
  ) {
    try {
      return await this.moodLogService.createForUser(req.user.sub, body, {
        photo: files?.photo?.[0],
        voice: files?.voice?.[0],
      });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Unexpected error in controller:', error);
      throw new InternalServerErrorException('Failed to create mood log');
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get('today')
  @ApiOperation({ summary: "Get today's mood log for the authenticated user" })
  @ApiResponse({ status: 200, description: 'Returns today’s mood log' })
  @ApiResponse({ status: 404, description: 'No mood log found for today' })
  async getToday(@Req() req: any) {
    // Let the exception bubble up naturally
    return await this.moodLogService.getTodayLogForUser(req.user.sub);
  }

  @UseGuards(JwtCookieGuard)
  @Get('history')
  @ApiOperation({ summary: 'Get mood log history with pagination' })
  @ApiQuery({ name: 'limit', required: false, example: 30 })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated mood log history for the user',
  })
  async getHistory(
    @Req() req: any,
    @Query('limit') limit = 30,
    @Query('page') page = 1,
  ) {
    try {
      return await this.moodLogService.getHistoryForUser(
        req.user.sub,
        Number(limit),
        Number(page),
      );
    } catch (error) {
      console.error('Error fetching mood log history:', error);
      throw new InternalServerErrorException(
        'Failed to fetch mood log history',
      );
    }
  }

  @UseGuards(JwtCookieGuard)
  @Get('range')
  @ApiOperation({ summary: 'Get mood logs in a date range' })
  async getRange(
    @Req() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.moodLogService.getLogsInRange(req.user.sub, start, end);
  }

  @UseGuards(JwtCookieGuard)
  @Get('streak')
  @ApiOperation({ summary: 'Get user mood log streak and total days logged' })
  async getStreak(@Req() req: any) {
    try {
      const result = await this.moodLogService.getMoodLogStreak(req.user.sub);
      return ResultDto.ok(result, 'Streak fetched successfully');
    } catch (error) {
      console.error('Error fetching mood log streak:', error);
      throw new InternalServerErrorException('Failed to fetch mood log streak');
    }
  }

  @Get('heatmap')
  @UseGuards(JwtCookieGuard)
  async getMoodHeatmap(@Req() req: any) {
    const userId = req.user.sub;
    return this.moodLogService.getHeatmapData(userId);
  }
}
