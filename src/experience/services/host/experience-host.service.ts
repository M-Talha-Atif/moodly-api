import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../../entities/experience.entity';
import { CreateExperienceDto } from '../../dto/create-experience.dto';
import { UpdateExperienceDto } from '../../dto/update-experience.dto';
import { User } from 'src/users/entities/user.entity';
import { ExperienceFilterService } from '../experience-filter.service';
import { S3Service } from 'src/common/services/s3.service';
import { formatDate } from 'src/common/utils/date.utils';
import { formatTime } from 'src/common/utils/time.utils';
import { HostExperienceFiltersDto } from 'src/experience/dto/host/experience-filters-host.dto';
import { ExperienceSortBy } from '../../dto/host/experience-filters-host.dto';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ExperienceHostService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    private readonly experienceFilterService: ExperienceFilterService, // filter service
    private readonly s3Service: S3Service, // S3 service for storage of images
    @Inject(RMQ_DOMAINS.EXPERIENCE.CLIENT)
    private readonly rmqClient: ClientProxy,
  ) {}

  // =========================================================
  // Create Experience 
  // =========================================================
  async create(dto: CreateExperienceDto, host: User): Promise<Experience> {
    const experience = this.experienceRepo.create({ ...dto, host });
    const saved = await this.experienceRepo.save(experience);
    this.rmqClient.emit(RMQ_DOMAINS.EXPERIENCE.ROUTING.GENERATE_AI, {
      experienceId: saved.id,
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
  // Update Experience
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
    // await this.experienceEmbeddingModel.deleteOne({ experienceId: id });
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
  // Find All Experiences for a host
  // =========================================================
  async findAllForHost(hostId: string, filters: HostExperienceFiltersDto) {
    const qb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoin('experience.host', 'host')
      .leftJoin('experience.bookings', 'booking')
      .where('host.id = :hostId', { hostId });

    // Apply filters first
    this.experienceFilterService.applyFiltersForHost(qb, filters);

    // Add COUNT of bookings
    qb.addSelect('COUNT(booking.id)', 'totalBookings').groupBy('experience.id');

    // Sorting
    if (filters.sortBy === ExperienceSortBy.BOOKINGS) {
      qb.orderBy('totalBookings', 'DESC');
    } else if (filters.sortBy === ExperienceSortBy.DATE) {
      qb.orderBy('experience.sessionStartTime', 'ASC');
    } else {
      qb.orderBy('experience.createdAt', 'DESC');
    }

    // FIX: Use offset and limit instead of skip and take for better GROUP BY support
    qb.offset((filters.page - 1) * filters.limit).limit(filters.limit);

    // Get raw results
    const raw = await qb.getRawMany();

    // Map results
    const result = raw.map((row) => ({
      id: row.experience_id,
      title: row.experience_title,
      image: row.experience_image,
      date: row.experience_sessionStartTime,
      totalSpots: row.experience_totalSpots,
      totalBookings: Number(row.totalBookings) || 0,
      status:
        new Date(row.experience_sessionStartTime).getTime() > Date.now()
          ? 'upcoming'
          : 'past',
    }));

    // Count query with same filters
    const countQb = this.experienceRepo
      .createQueryBuilder('experience')
      .leftJoin('experience.host', 'host')
      .where('host.id = :hostId', { hostId });

    this.experienceFilterService.applyFiltersForHost(countQb, filters);

    const total = await countQb.getCount();

    const totalPages = Math.ceil(total / filters.limit);
    const hasNextPage = filters.page < totalPages;
    const hasPrevPage = filters.page > 1;

    return {
      data: result,
      meta: {
        total,
        page: filters.page,
        limit: filters.limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? filters.page + 1 : null,
        prevPage: hasPrevPage ? filters.page - 1 : null,
      },
    };
  }

  // =========================================================
  // Find Single Experience by ID (Host Only)
  // =========================================================
  async findOneForHost(id: string, hostId: string) {
    const qb = this.experienceRepo
      .createQueryBuilder('experience')
      .where('experience.id = :id', { id })
      .andWhere('experience.hostId = :hostId', { hostId });

    const experience = await qb.getOne();
    if (!experience) return null;

    // return fields needed for update form, format dates/times
    return {
      id: experience.id,
      title: experience.title,
      description: experience.description,
      date: formatDate(experience.date),
      location: experience.location,
      image: experience.image,
      meetLink: experience.meetingLink,
      price: experience.price,
      isVirtual: experience.isVirtual,
      sessionStartTime: formatTime(experience.sessionStartTime),
      sessionEndTime: formatTime(experience.sessionEndTime),
      totalSpots: experience.totalSpots,
      timezone: experience.timezone,
      language: experience.language,
      targetEmotions: experience.targetEmotions || [],
      desiredOutcomes: experience.desiredOutcomes || [],
      culturalTags: experience.culturalTags || [],
    };
  }
}
