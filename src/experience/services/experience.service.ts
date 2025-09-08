import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';
import { ExperienceFilterService } from './experience-filter.service';
import { ExperienceFiltersDto } from '../dto/experience-filters.dto';
import { S3Service } from 'src/common/services/s3.service';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    private readonly embeddingService: EmbeddingService, // embedding service
    @InjectModel(ExperienceEmbedding.name)
    private readonly experienceEmbeddingModel: Model<ExperienceEmbedding>,
    private readonly experienceFilterService: ExperienceFilterService, // filter service
    private readonly s3Service: S3Service, // S3 service for storage of images
  ) {}

  // =========================================================
  // Create Experience + Store Embedding in Mongo
  // =========================================================
  async create(dto: CreateExperienceDto, host: User): Promise<Experience> {
    const experience = this.experienceRepo.create({ ...dto, host });
    const saved = await this.experienceRepo.save(experience);

    // Generate embedding based on title + description + desired outcomes
    const combinedText = `${dto.title} ${dto.description} ${dto.desiredOutcomes?.join(' ')} ${dto.targetEmotions?.join(' ')}`;
    const embedding =
      await this.embeddingService.generateEmbedding(combinedText);

    // Store embedding in Mongo
    await this.experienceEmbeddingModel.create({
      experienceId: saved.id,
      embedding,
    });

    return saved;
  }

  async findAllPublic(
    filters: ExperienceFiltersDto,
  ): Promise<[Experience[], number]> {
    const page = Number(filters.page) || 1; // fallback to 1
    const limit = Number(filters.limit) || 10; // fallback to 10

    const qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .orderBy('experience.createdAt', 'DESC');

    this.experienceFilterService.applyFilters(qb, filters);

    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async findAllForUser(
    userId: string,
    filters: ExperienceFiltersDto,
  ): Promise<{
    data: Experience[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    let qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .leftJoin(
        'experience.bookings',
        'booking',
        `booking.userId = :userId AND booking.status != 'cancelled'`,
        { userId },
      )
      .orderBy('experience.createdAt', 'DESC');

    this.experienceFilterService.applyFilters(qb, filters);

    qb.skip((filters.page - 1) * filters.limit).take(filters.limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages: Math.ceil(total / filters.limit),
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
  async update(
    id: string,
    dto: UpdateExperienceDto,
    newImageFile?: Express.Multer.File, // optional file
  ): Promise<Experience> {
    const updated = await this.findOne(id);
    if (!updated) throw new NotFoundException('Experience not found');

    // Handle new image upload
    if (newImageFile) {
      // Upload new image to S3
      const url = await this.s3Service.uploadBuffer(
        newImageFile.buffer,
        newImageFile.originalname,
        newImageFile.mimetype,
      );

      // Delete old image from S3 if it exists
      if (updated.image) {
        const oldKey = updated.image.replace(`${process.env.S3_BASE_URL}/`, '');
        await this.s3Service.deleteObject(oldKey);
      }

      dto.image = url; // update DTO image field
    }

    // Merge DTO fields
    Object.assign(updated, dto);

    // Re-generate embedding
    const combinedText = `${updated.title} ${updated.description} ${updated.desiredOutcomes?.join(' ')} ${dto.targetEmotions?.join(' ')}`;
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
    const experience = await this.findOne(id);
    if (!experience) throw new NotFoundException('Experience not found');
    // Delete image from S3 if exists
    if (experience.image) {
      const key = experience.image.replace(`${process.env.S3_BASE_URL}/`, '');
      await this.s3Service.deleteObject(key);
    }
    await this.experienceRepo.delete(id);
    await this.experienceEmbeddingModel.deleteOne({ experienceId: id });
  }
}
