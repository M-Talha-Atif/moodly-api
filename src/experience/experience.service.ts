import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';

import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { ILike, Between, In, Brackets } from 'typeorm';
import {
  startOfDay,
  endOfDay,
  addDays,
  nextSaturday,
  nextSunday,
} from 'date-fns';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepo: Repository<Experience>,
  ) {}

  async create(dto: CreateExperienceDto, host: User): Promise<Experience> {
    const experience = this.experienceRepo.create({ ...dto, host });
    return this.experienceRepo.save(experience);
  }

  // // optional: get all experiences
  // async findAll(): Promise<Experience[]> {
  //   return this.experienceRepo.find({ relations: ['host'] });
  // }

  // let say page is 4, then 3 * 10 is 30 so skipping 30 records from start

  async findAll(
    page = 1,
    limit = 10,
    cultureTags?: string[],
    timeFilter?: string,
    search?: string,
  ): Promise<[Experience[], number]> {
    const where: any[] = [];

    // Search conditions (case-insensitive partial matches)
    if (search) {
      const lowerSearch = `%${search.toLowerCase()}%`;
      where.push({
        title: ILike(lowerSearch),
      });
      where.push({
        description: ILike(lowerSearch),
      });
      where.push({
        location: ILike(lowerSearch),
      });
    }

    // Time filter
    const now = new Date();
    let dateRange: [Date, Date] | null = null;

    switch (timeFilter) {
      case 'today':
        dateRange = [startOfDay(now), endOfDay(now)];
        break;
      case 'tomorrow':
        dateRange = [startOfDay(addDays(now, 1)), endOfDay(addDays(now, 1))];
        break;
      case 'weekend':
        dateRange = [startOfDay(nextSaturday(now)), endOfDay(nextSunday(now))];
        break;
      case 'next-week':
        dateRange = [startOfDay(addDays(now, 1)), endOfDay(addDays(now, 7))];
        break;
    }

    const queryBuilder = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .orderBy('experience.date', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);

    if (cultureTags && cultureTags.length > 0) {
      queryBuilder.andWhere(`"experience"."culturalTags" && :tags`, {
        tags: cultureTags,
      });
    }

    if (dateRange) {
      queryBuilder.andWhere('experience.date BETWEEN :start AND :end', {
        start: dateRange[0],
        end: dateRange[1],
      });
    }

    if (search) {
      queryBuilder.andWhere(
        `(LOWER(experience.title) ILIKE :search OR LOWER(experience.description) ILIKE :search OR LOWER(experience.location) ILIKE :search)`,
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const [results, total] = await queryBuilder.getManyAndCount();
    return [results, total];
  }

  async findOne(id: string): Promise<Experience | null> {
    return this.experienceRepo.findOne({
      where: { id },
      relations: ['host'],
    });
  }

  async update(id: string, dto: UpdateExperienceDto): Promise<Experience> {
    await this.experienceRepo.update(id, dto);
    const updated = await this.findOne(id);
    if (!updated)
      throw new NotFoundException('Experience not found after update');
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.experienceRepo.delete(id);
  }
}
