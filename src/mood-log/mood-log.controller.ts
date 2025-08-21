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
} from '@nestjs/common';
import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';
import { MoodLogService } from './services/mood-log.service';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';

@Controller('mood-log')
export class MoodLogController {
  constructor(private readonly moodLogService: MoodLogService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
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
      console.log(files);
      console.log(body);
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
  async getToday(@Req() req: any) {
    try {
      return await this.moodLogService.getTodayLogForUser(req.user.sub);
    } catch (error) {
      console.error("Error fetching today's mood log:", error);
      throw new InternalServerErrorException(
        "Failed to fetch today's mood log",
      );
    }
  }
  @UseGuards(JwtCookieGuard)
  @Get('history')
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
}
