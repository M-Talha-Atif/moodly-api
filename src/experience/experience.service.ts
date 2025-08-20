import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, ILike } from 'typeorm';
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
    private readonly experienceRepo: Repository<Experience>,
    private readonly embeddingService: EmbeddingService,
    @InjectModel(ExperienceEmbedding.name)
    private readonly experienceEmbeddingModel: Model<ExperienceEmbedding>,
  ) {}

  // =========================================================
  // Create Experience + Store Embedding in Mongo
  // =========================================================
  async create(dto: CreateExperienceDto, host: User): Promise<Experience> {
    const experience = this.experienceRepo.create({ ...dto, host });
    const saved = await this.experienceRepo.save(experience);

    // Generate embedding based on title + description + desired outcomes
    const combinedText = `${dto.title} ${dto.description} ${dto.desiredOutcomes?.join(' ')}`;
    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    // Store embedding in Mongo
    await this.experienceEmbeddingModel.create({
      experienceId: saved.id,
      embedding,
    });

    return saved;
  }

  // =========================================================
  // Public Fetch (no personalization)
  // =========================================================
  async findAllPublic(
    page = 1,
    limit = 10,
    cultureTags?: string[],
    timeFilter?: string,
    search?: string,
  ): Promise<[Experience[], number]> {
    // Base query
    let qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .orderBy('experience.createdAt', 'DESC');

    // Apply filters
    qb = this.applyFilters(qb, cultureTags, timeFilter, search);

    // Add pagination
    qb.skip((page - 1) * limit).take(limit);

    // Execute query
    return qb.getManyAndCount();
  }

  // =========================================================
  // User Fetch (adds personalization like "isBooked")
  // =========================================================
  async findAllForUser(
    userId: string,
    page = 1,
    limit = 10,
    cultureTags?: string[],
    timeFilter?: string,
    search?: string,
  ): Promise<{
    data: any[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    // Base query with joins
    let qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .leftJoin('experience.bookings', 'booking', 'booking.userId = :userId', {
        userId,
      })
      .orderBy('experience.createdAt', 'DESC');

    // Apply filters
    qb = this.applyFilters(qb, cultureTags, timeFilter, search);

    // Add booking-related fields
    qb.addSelect(
      'CASE WHEN booking.id IS NOT NULL THEN true ELSE false END',
      'experience_isBooked',
    )
      .addSelect('booking.id', 'booking_id')
      .addSelect('booking.status', 'booking_status');

    // Paginated fetch
    const { raw, entities } = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getRawAndEntities();

    const data = entities.map((entity, i) => ({
      ...entity,
      isBooked: Boolean(raw[i]['experience_isBooked']),
      bookingId: raw[i]['booking_id'] || null,
      bookingStatus: raw[i]['booking_status'] || null,
    }));

    // Separate count query (no skip/take)
    let countQb = this.experienceRepo.createQueryBuilder('experience');
    countQb = this.applyFilters(countQb, cultureTags, timeFilter, search);
    const total = await countQb.getCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // =========================================================
  // Get Single Experience by ID
  // =========================================================
  async findOne(id: string): Promise<Experience | null> {
    return this.experienceRepo.findOne({
      where: { id },
      relations: ['host'],
    });
  }

  async findOneWithBooking(expId: string, userId: string) {
    const qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .leftJoinAndSelect(
        'experience.bookings',
        'booking',
        'booking.userId = :userId',
        { userId },
      )
      .where('experience.id = :expId', { expId });

    const experience = await qb.getOne();

    if (!experience) return null;
    const userBooking = experience.bookings?.[0] || null;

    // if booking exists but is cancelled, ignore it
    if (userBooking?.status === 'cancelled') {
      return {
        ...experience,
        isBooked: false,
        bookingId: null,
        bookingStatus: null,
      };
    }

    return {
      ...experience,
      isBooked: !!userBooking,
      bookingId: userBooking?.id || null,
      bookingStatus: userBooking?.status || null, // confirmed | waitlisted
    };
  }

  // =========================================================
  // Update Experience + Update Embedding in Mongo
  // =========================================================
  async update(id: string, dto: UpdateExperienceDto): Promise<Experience> {
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Experience not found');

    Object.assign(updated, dto);

    // Re-generate embedding
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

  // =========================================================
  // Delete Experience + Delete Embedding from Mongo
  // =========================================================
  async remove(id: string): Promise<void> {
    await this.experienceRepo.delete(id);
    await this.experienceEmbeddingModel.deleteOne({ experienceId: id });
  }

  // =========================================================
  // Private Helper: Apply filters (tags, search, time) + Pagination
  // =========================================================
  private applyFilters(
    qb: SelectQueryBuilder<Experience>,
    cultureTags?: string[],
    timeFilter?: string,
    search?: string,
  ): SelectQueryBuilder<Experience> {
    // Filter by tags
    if (cultureTags && cultureTags.length > 0) {
      qb.andWhere('experience.culturalTags && ARRAY[:...tags]', {
        tags: cultureTags,
      });
    }

    // Search by title or description
    if (search) {
      qb.andWhere(
        '(experience.title ILIKE :search OR experience.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Time-based filters
    if (timeFilter) {
      const now = new Date();
      let start: Date | null = null;
      let end: Date | null = null;

      switch (timeFilter) {
        case 'today':
          start = startOfDay(now);
          end = endOfDay(now);
          break;
        case 'tomorrow':
          start = startOfDay(addDays(now, 1));
          end = endOfDay(addDays(now, 1));
          break;
        case 'weekend':
          start = startOfDay(nextSaturday(now));
          end = endOfDay(nextSunday(now));
          break;
      }

      if (start && end) {
        qb.andWhere('experience.startTime BETWEEN :start AND :end', {
          start,
          end,
        });
      }
    }

    return qb;
  }
}
