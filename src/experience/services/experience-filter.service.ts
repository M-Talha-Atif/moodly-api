// experience-filter.service.ts
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { Experience } from './../entities/experience.entity';
import { timeFilterMap } from 'src/common/utils/time-filters';
import { ExperienceFiltersDto } from './../dto/experience-filters.dto';

@Injectable()
export class ExperienceFilterService {
  // experience-filter.service.ts
  applyFilters(
    qb: SelectQueryBuilder<Experience>,
    filters: ExperienceFiltersDto,
  ) {
    const { cultureTags, desiredOutcomes, targetEmotions, timeFilter, search } =
      filters;

    // Check if array exists and has non-empty values (excluding "all")
    if (
      cultureTags?.length &&
      cultureTags.some((tag) => tag.trim() !== '' && tag !== 'all')
    ) {
      const filteredTags = cultureTags.filter(
        (tag) => tag.trim() !== '' && tag !== 'all',
      );
      if (filteredTags.length > 0) {
        qb.andWhere(`experience.culturalTags && :cultureTags::text[]`, {
          cultureTags: filteredTags,
        });
      }
    }

    // Check if array exists and has non-empty values (excluding "all")
    if (
      targetEmotions?.length &&
      targetEmotions.some(
        (emotion) => emotion.trim() !== '' && emotion !== 'all',
      )
    ) {
      const filteredEmotions = targetEmotions.filter(
        (emotion) => emotion.trim() !== '' && emotion !== 'all',
      );
      if (filteredEmotions.length > 0) {
        qb.andWhere(`experience.targetEmotions && :targetEmotions::text[]`, {
          targetEmotions: filteredEmotions,
        });
      }
    }

    // Check if array exists and has non-empty values (excluding "all")
    if (
      desiredOutcomes?.length &&
      desiredOutcomes.some(
        (outcome) => outcome.trim() !== '' && outcome !== 'all',
      )
    ) {
      const filteredOutcomes = desiredOutcomes.filter(
        (outcome) => outcome.trim() !== '' && outcome !== 'all',
      );
      if (filteredOutcomes.length > 0) {
        qb.andWhere(`experience.desiredOutcomes && :desiredOutcomes::text[]`, {
          desiredOutcomes: filteredOutcomes,
        });
      }
    }

    if (search && search.trim() !== '') {
      qb.andWhere(
        'experience.title ILIKE :search OR experience.location ILIKE :search',
        { search: `%${search.trim()}%` },
      );
    }

    if (timeFilter && timeFilter !== 'all' && timeFilterMap[timeFilter]) {
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

  // Host-specific filters
  applyFiltersForHost(qb: SelectQueryBuilder<Experience>, filters: any) {
    // Apply generic filters first
    this.applyFilters(qb, filters);

    // Total spots filter
    if (filters.minSpots !== undefined) {
      qb.andWhere('experience.totalSpots >= :minSpots', {
        minSpots: filters.minSpots,
      });
    }

    if (filters.maxSpots !== undefined) {
      qb.andWhere('experience.totalSpots <= :maxSpots', {
        maxSpots: filters.maxSpots,
      });
    }

    // Status filter (past/upcoming)
    if (filters.status) {
      const now = new Date();
      if (filters.status === 'upcoming') {
        qb.andWhere('experience.sessionStartTime > :now', { now });
      } else if (filters.status === 'past') {
        qb.andWhere('experience.sessionStartTime <= :now', { now });
      }
    }

    return qb;
  }
}
