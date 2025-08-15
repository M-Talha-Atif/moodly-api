import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Put,
  Get,
  UploadedFile,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { JwtCookieGuard } from '../auth/jwt-cookie.guard';
import { CreateEmotionDto } from './dto/create-emotion.dto';
import { UpdateEmotionDto } from './dto/update-emotion.dto';
import { EmotionDetectionService } from './emotion-detection.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResultDto } from '../common/dto/result.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('emotion')
export class EmotionController {
  constructor(
    private readonly emotionService: EmotionService,
    private readonly detectionService: EmotionDetectionService,
  ) {}

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

  @UseGuards(JwtCookieGuard)
  @Post('detect')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  async detectEmotion(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      return ResultDto.fail('Image file is required', 400, 'MISSING_FILE');
    }

    try {
      const userId = req.user.sub;
      const dominantEmotion = await this.detectionService.detectEmotionFromFile(
        file.path,
      );

      console.log(`Detected emotion: ${dominantEmotion}`);
      return ResultDto.ok(
        { dominant_emotion: dominantEmotion },
        'Emotion detected and saved',
      );
    } catch (error) {
      return ResultDto.fail(
        error.message,
        503, // Service Unavailable
        'EMOTION_DETECTION_FAILED',
      );
    }
  }
}
