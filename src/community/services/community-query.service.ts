import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../entities/community.entity';
import { CommunityListItemDto } from '../dto/community-list-item.dto';
import { CommunityResponseDto } from '../dto/community-response.dto';
import { CommunityMapper } from '../mapper/community.mapper';

@Injectable()
export class CommunityQueryService {
  constructor(
    @InjectRepository(Community)
    private communityRepository: Repository<Community>,
  ) {}

  /**
   * Get paginated list of communities
   */
  async findAll(
    page = 1,
    limit = 10,
  ): Promise<{
    data: CommunityListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [communities, total] = await this.communityRepository.findAndCount({
      relations: ['members'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }, // optional sorting
    });

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
      relations: ['owner', 'members', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');

    return CommunityMapper.toResponseDto(community);
  }
}
