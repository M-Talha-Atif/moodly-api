import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';

import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';

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

  // optional: get all experiences
  async findAll(): Promise<Experience[]> {
    return this.experienceRepo.find({ relations: ['host'] });
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
