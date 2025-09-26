import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { CreateExperienceDto } from '../dto/create-experience.dto';
import { UpdateExperienceDto } from '../dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';
import { ExperienceFilterService } from './experience-filter.service';
import { ExperienceFiltersDto } from '../dto/experience-filters.dto';
import { S3Service } from 'src/common/services/s3.service';
import { formatDate } from 'src/common/utils/date.utils';

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
    data: any[]; // you can replace with DTO if strict typing needed
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoin('experience.host', 'host')
      .leftJoin(
        'experience.bookings',
        'booking',
        `booking.userId = :userId AND booking.status != 'cancelled'`,
        { userId },
      )
      .select([
        'experience.id',
        'experience.title',
        'experience.date',
        'experience.price',
        'experience.description',
        'experience.spotsFilled',
        'experience.location',
        'experience.sessionStartTime',
        'experience.sessionEndTime',
        'experience.timezone',
        'experience.totalSpots',
        'experience.image',
        'host.id',
        'host.name',
      ])
      .addSelect('booking.id', 'bookingId') // <-- booking id
      .addSelect(
        `CASE WHEN booking.id IS NOT NULL THEN true ELSE false END`,
        'isBooked',
      )
      .orderBy('experience.date', 'DESC');

    this.experienceFilterService.applyFilters(qb, filters);

    qb.skip((filters.page - 1) * filters.limit).take(filters.limit);

    const [entities, total] = await qb.getManyAndCount();
    const rawData = await qb.getRawMany(); // get "isBooked"

    const data = entities.map((exp, idx) => ({
      id: exp.id,
      title: exp.title,
      description: exp.description,
      image: exp.image,
      price: exp.price,
      date: formatDate(exp.date),
      createdAt: exp.createdAt,
      location: exp.location,
      sessionStartTime: exp.sessionStartTime,
      sessionEndTime: exp.sessionEndTime,
      totalSpots: exp.totalSpots,
      spotsFilled: exp.spotsFilled,
      host: {
        id: exp.host.id,
        name: exp.host.name,
      },
      bookingId: rawData[idx]?.bookingId || null,
      isBooked:
        rawData[idx]?.isBooked === true || rawData[idx]?.isBooked === 'true',
    }));

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

    // Return only relevant fields
    return {
      id: experience.id,
      title: experience.title,
      description: experience.description,
      date: formatDate(experience.date),
      location: experience.location,
      image: experience.image,
      price: experience.price,
      isVirtual: experience.isVirtual,
      sessionStartTime: formatDate(experience.sessionStartTime),
      sessionEndTime: formatDate(experience.sessionEndTime),
      totalSpots: experience.totalSpots,
      spotsFilled: experience.spotsFilled,
      timezone: experience.timezone,

      // Booking info (for current user only)
      isBooked: !!userBooking && userBooking.status !== 'cancelled',
      bookingId:
        userBooking && userBooking.status !== 'cancelled'
          ? userBooking.id
          : null,
      bookingStatus:
        userBooking && userBooking.status !== 'cancelled'
          ? userBooking.status
          : null,

      // Host info (basic only)
      host: {
        id: experience.host.id,
        name: experience.host.name,
        avatarUrl: experience.host.avatarUrl,
      },
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

  async findBookingsForExperience(expId: string) {
    return this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoinAndSelect('experience.bookings', 'booking')
      .leftJoinAndSelect('booking.user', 'user')
      .where('experience.id = :expId', { expId })
      .orderBy('booking.createdAt', 'DESC')
      .getOne()
      .then((exp) => exp?.bookings || []);
  }
}
