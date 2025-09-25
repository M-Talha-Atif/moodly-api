import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../../entities/experience.entity';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { CreateExperienceDto } from '../../dto/create-experience.dto';
import { UpdateExperienceDto } from '../../dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';
import { ExperienceFilterService } from '../experience-filter.service';
import { ExperienceFiltersDto } from '../../dto/experience-filters.dto';
import { S3Service } from 'src/common/services/s3.service';
import { formatDate } from 'src/common/utils/date.utils';

@Injectable()
export class ExperienceHostService {
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

  // =========================================================
  // Get Single Experience by ID
  // =========================================================
  async findOne(id: string): Promise<Experience | null> {
    return this.experienceRepo.findOne({
      where: { id },
      relations: ['host'],
    });
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

  // =========================================================
  // Find Bookings For a Host's Experience (clean response)
  // =========================================================
  async findBookingsForExperience(expId: string) {
    const bookings = await this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.bookings', 'booking')
      .leftJoinAndSelect('booking.user', 'user')
      .where('experience.id = :expId', { expId })
      .orderBy('booking.createdAt', 'DESC')
      .getOne();

    if (!bookings) return [];

    return bookings.bookings.map((b) => ({
      id: b.id,
      status: b.status,
      createdAt: b.createdAt,
      user: {
        id: b.user.id,
        name: b.user.name,
        email: b.user.email,
        avatarUrl: b.user.avatarUrl,
        languagePreferences: b.user.languagePreferences,
      },
    }));
  }

  // =========================================================
  // Find All Experiences for a Host with Filters
  // =========================================================
  async findAllForHost(hostId: string, filters: ExperienceFiltersDto) {
    const query = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.host', 'host')
      .where('host.id = :hostId', { hostId })
      .orderBy('experience.createdAt', 'DESC');

    // apply filters (using your filter service)
    this.experienceFilterService.applyFilters(query, filters);

    const [data, count] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total: count,
        page: filters.page || 1,
        limit: filters.limit || 10,
      },
    };
  }

  // =========================================================
  // Find Single Experience by ID (Host Only)
  // =========================================================
  async findOneForHost(id: string, hostId: string): Promise<Experience | null> {
    return this.experienceRepo.findOne({
      where: { id, host: { id: hostId } },
      relations: ['host'],
    });
  }
}
