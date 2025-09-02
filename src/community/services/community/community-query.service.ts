import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../../entities/community/community.entity';
import { CommunityListItemDto } from '../../dto/community-list-item.dto';
import { CommunityResponseDto } from '../../dto/community-response.dto';
import { CommunityMapper } from '../../mapper/community/community.mapper';
import { CommunityQueryDto } from '../../dto/community-query.dto';

@Injectable()
export class CommunityQueryService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  /**
   * Get paginated + filtered list of communities
   */
  async findAll(
    query?: CommunityQueryDto, // <-- make optional
  ): Promise<{
    data: CommunityListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      category,
      isPrivate,
      tags,
      search,
    } = query ?? {}; // <--  handle undefined

    const qb = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.members', 'members')
      .orderBy('community.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    // case-insensitive category filter
    if (category) {
      qb.andWhere('LOWER(community.category) = LOWER(:category)', {
        category,
      });
    }

    if (isPrivate !== undefined) {
      qb.andWhere('community.isPrivate = :isPrivate', { isPrivate });
    }

    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : String(tags).split(',');
      tagsArray.forEach((tag, idx) => {
        qb.andWhere(`community.tags ILIKE :tag${idx}`, {
          [`tag${idx}`]: `%${tag.trim()}%`,
        });
      });
    }

    if (search) {
      qb.andWhere(
        '(community.name ILIKE :search OR community.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [communities, total] = await qb.getManyAndCount();

    // sync memberCount
    communities.forEach(
      (c) => (c.memberCount = c.members?.length ?? c.memberCount ?? 0),
    );

    return {
      data: communities.map((community) =>
        CommunityMapper.toListItemDto(community),
      ),
      total,
      page,
      limit,
    };
  }

  /**
   * Get detailed community data by ID
   */
  async findOne(id: string): Promise<CommunityResponseDto> {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');

    community.memberCount = community.members?.length ?? 0;

    return CommunityMapper.toResponseDto(community);
  }
}
