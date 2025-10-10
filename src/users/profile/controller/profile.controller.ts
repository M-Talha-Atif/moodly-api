// src/profile/controller/profile.controller.ts
import {
  Controller,
  Patch,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { RolesGuard } from 'src/common/roles.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(JwtCookieGuard, RolesGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Fetch current user profile details' })
  async getProfile(@Req() req) {
    return this.profileService.getProfile(req.user.sub);
  }

  @Patch()
  @ApiOperation({ summary: 'Update profile (name, optional avatar upload)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Req() req,
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.profileService.updateProfile(req.user.sub, dto, file);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Change password' })
  async updatePassword(@Req() req, @Body() dto: UpdatePasswordDto) {
    return this.profileService.updatePassword(req.user.sub, dto);
  }
}
