// experience-filter.service.ts
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Experience } from './../entities/experience.entity';
import { timeFilterMap } from 'src/common/utils/time-filters';
import { ExperienceFiltersDto } from './../dto/experience-filters.dto';

@Injectable()
export class ExperienceFilterService {
  applyFilters(
    qb: SelectQueryBuilder<Experience>,
    filters: ExperienceFiltersDto,
  ) {
    const { cultureTags, desiredOutcomes, targetEmotions, timeFilter, search } =
      filters;

    if (cultureTags?.length) {
      qb.andWhere(`experience.culturalTags && :cultureTags::text[]`, {
        cultureTags,
      });
    }

    if (targetEmotions?.length) {
      qb.andWhere(`experience.targetEmotions && :targetEmotions::text[]`, {
        targetEmotions,
      });
    }

    if (desiredOutcomes?.length) {
      qb.andWhere(`experience.desiredOutcomes && :desiredOutcomes::text[]`, {
        desiredOutcomes,
      });
    }

    if (search) {
      qb.andWhere(
        'experience.title ILIKE :search OR experience.location ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (timeFilter && timeFilterMap[timeFilter]) {
      const now = new Date();
      const range = timeFilterMap[timeFilter](now);

      if (range) {
        qb.andWhere('experience.sessionStartTime BETWEEN :start AND :end', {
          start: range.start,
          end: range.end,
        });
      }
    }

    return qb;
  }
}
