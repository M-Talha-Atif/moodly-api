import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExperienceService } from '../services/experience.service';
import { JwtCookieGuard } from 'src/auth/guards/jwt-cookie.guard';
import { Roles } from 'src/common/roles.decorator';
import { RolesGuard } from 'src/common/roles.guard';
import { ExperienceFiltersDto } from '../dto/experience-filters.dto';
import { ExperienceListItemDto } from '../dto/experience-list-item.dto';
import { ExperienceResponseDto } from '../dto/experience-response.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import { plainToInstance } from 'class-transformer';
import { JwtBearerGuard } from 'src/auth/guards/jwt-bearer.guard';

@ApiTags('User Experiences')
@Controller('user/experiences')
@UseGuards(JwtBearerGuard, JwtCookieGuard, RolesGuard)
@Roles('user')
export class ExperienceUserController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAllForUser(@Req() req, @Query() filters: ExperienceFiltersDto) {
    const result = await this.experienceService.findAllForUser(
      req.user.sub,
      filters,
    );

    return ResultDto.ok(
      {
        data: plainToInstance(ExperienceListItemDto, result.data, {
          excludeExtraneousValues: true,
        }),
        meta: result.meta,
      },
      'User experiences fetched successfully',
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a single experience by ID' })
  @ApiResponse({
    status: 200,
    description: 'Experience fetched successfully',
    type: ExperienceResponseDto,
  })
  async findOne(@Req() req, @Param('id') experienceId: string) {
    const userId = req.user.sub;
    const experience = await this.experienceService.findOneWithBooking(
      experienceId,
      userId,
    );
    if (!experience) return ResultDto.fail('Experience not found', 404);

    return ResultDto.ok(
      plainToInstance(ExperienceResponseDto, experience),
      'Experience fetched successfully',
    );
  }
}
