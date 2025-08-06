import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import {
  startOfDay,
  endOfDay,
  addDays,
  nextSaturday,
  nextSunday,
} from 'date-fns';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private experienceRepo: Repository<Experience>,
    private readonly embeddingService: EmbeddingService,
    @InjectModel(ExperienceEmbedding.name)
    private experienceEmbeddingModel: Model<ExperienceEmbedding>,
  ) {}

  // === Create Experience + Store Embedding in Mongo ===
  async create(dto: CreateExperienceDto, host: User): Promise<Experience> {
    const experience = this.experienceRepo.create({ ...dto, host });
    const saved = await this.experienceRepo.save(experience);

    const combinedText = `${dto.title} ${dto.description} ${dto.desiredOutcomes?.join(' ')}`;
    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    await this.experienceEmbeddingModel.create({
      experienceId: saved.id,
      embedding,
    });

    return saved;
  }

  // === Filter + Paginate Experiences ===
  async findAll(
    page = 1,
    limit = 10,
    cultureTags?: string[],
    timeFilter?: string,
    search?: string,
  ): Promise<[Experience[], number]> {
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

    if (cultureTags?.length) {
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

  // === Get Single Experience ===
  async findOne(id: string): Promise<Experience | null> {
    return this.experienceRepo.findOne({
      where: { id },
      relations: ['host'],
    });
  }

  // === Update Experience + Update Embedding in Mongo ===
  async update(id: string, dto: UpdateExperienceDto): Promise<Experience> {
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Experience not found');

    Object.assign(updated, dto);

    const combinedText = `${updated.title} ${updated.description} ${updated.desiredOutcomes?.join(' ')}`;
    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    await this.experienceEmbeddingModel.updateOne(
      { experienceId: updated.id },
      { $set: { embedding } },
      { upsert: true },
    );

    return this.experienceRepo.save(updated);
  }

  // === Delete Experience + Embedding ===
  async remove(id: string): Promise<void> {
    await this.experienceRepo.delete(id);
    await this.experienceEmbeddingModel.deleteOne({ experienceId: id });
  }

  // === Vector Search (Recommendations) ===
  async recommendForUser(
    userEmbedding: number[],
    limit = 10,
  ): Promise<Experience[]> {
    const similarEmbeddings = await this.experienceEmbeddingModel.aggregate([
      {
        $vectorSearch: {
          queryVector: userEmbedding,
          path: 'embedding',
          numCandidates: 100,
          limit: limit,
          index: 'experience_vector_index',
          metric: 'cosine',
        },
      } as any,
    ]);

    const experienceIds = similarEmbeddings.map((e) => e.experienceId);
    if (experienceIds.length === 0) return [];

    const experiences = await this.experienceRepo.find({
      where: { id: In(experienceIds) },
      relations: ['host'],
    });

    const experienceMap = new Map(experiences.map((e) => [e.id, e]));
    return experienceIds
      .map((id) => experienceMap.get(id))
      .filter(Boolean) as Experience[];
  }
}
