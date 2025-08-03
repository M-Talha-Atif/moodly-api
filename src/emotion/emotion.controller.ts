import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';

@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @UseGuards(JwtCookieGuard)
  @Post('profile')
  async saveProfile(@Body() dto: CreateEmotionDto, @Req() req: any) {
    const userId = req.user.sub;
    return this.emotionService.create(userId, dto);
  }

  @UseGuards(JwtCookieGuard)
  @Put('profile')
  async updateProfile(@Body() dto: UpdateEmotionDto, @Req() req: any) {
    const userId = req.user.sub;
    const existing = await this.emotionService.findByUserId(userId);

    if (!existing) throw new NotFoundException('Profile not found');

    return this.emotionService.update(userId, dto);
  }

  @UseGuards(JwtCookieGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.sub;
    return this.emotionService.findByUserId(userId);
  }
}
