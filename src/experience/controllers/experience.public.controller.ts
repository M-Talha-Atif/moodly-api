import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExperienceService } from '../services/experience.service';
import { ExperienceFiltersDto } from '../dto/experience-filters.dto';
import { ExperienceListItemDto } from '../dto/experience-list-item.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Public Experiences')
@Controller('public/experiences')
export class ExperiencePublicController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Get()
  async findAllPublic(@Query() filters: ExperienceFiltersDto) {
    const [data, total] = await this.experienceService.findAllPublic(filters);

    return ResultDto.ok(
      {
        data: plainToInstance(ExperienceListItemDto, data, {
          excludeExtraneousValues: true,
        }),
        meta: {
          total,
          page: filters.page,
          limit: filters.limit,
          totalPages: Math.ceil(total / filters.limit),
        },
      },
      'Public experiences fetched successfully',
    );
  }
}
