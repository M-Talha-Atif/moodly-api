import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';
import { MoodLogService } from './mood-log.service';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';

@Controller('mood-log')
export class MoodLogController {
  constructor(private readonly moodLogService: MoodLogService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
  async create(@Body() dto: CreateMoodLogDto, @Req() req: any) {
    try {
      return await this.moodLogService.createForUser(req.user.sub, dto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

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
}
