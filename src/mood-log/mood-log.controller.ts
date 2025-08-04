import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { JwtCookieGuard } from 'src/auth/jwt-cookie.guard';
import { MoodLogService } from './mood-log.service';
import { CreateMoodLogDto } from './dto/create-mood-log.dto';

@Controller('mood-log')
export class MoodLogController {
  constructor(private readonly moodLogService: MoodLogService) {}

  @UseGuards(JwtCookieGuard)
  @Post()
  async create(@Body() dto: CreateMoodLogDto, @Req() req: any) {
    return this.moodLogService.createForUser(req.user.sub, dto);
  }

  @UseGuards(JwtCookieGuard)
  @Get('today')
  async getToday(@Req() req: any) {
    return this.moodLogService.getTodayLogForUser(req.user.sub);
  }
}
