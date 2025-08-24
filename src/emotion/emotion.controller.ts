import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { ResultDto } from '../common/dto/result.dto';

@Controller('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  @UseGuards(JwtCookieGuard)
  @Post('profile')
  async saveProfile(@Body() dto: CreateEmotionDto, @Req() req: any) {
    const userId = req.user.sub;
    const created = await this.emotionService.create(userId, dto);
    return ResultDto.ok(created, 'Profile created successfully');
  }

  @UseGuards(JwtCookieGuard)
  @Put('profile')
  async updateProfile(@Body() dto: UpdateEmotionDto, @Req() req: any) {
    const userId = req.user.sub;
    const existing = await this.emotionService.findByUserId(userId);

    if (!existing) {
      return ResultDto.fail('Profile not found', 404, 'NOT_FOUND');
    }

    const updated = await this.emotionService.update(userId, dto);
    return ResultDto.ok(updated, 'Profile updated successfully');
  }

  @UseGuards(JwtCookieGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId = req.user.sub;
    const profile = await this.emotionService.findByUserId(userId);
    if (!profile) {
      return ResultDto.fail('Profile not found', 404, 'NOT_FOUND');
    }
    return ResultDto.ok(profile);
  }
}
