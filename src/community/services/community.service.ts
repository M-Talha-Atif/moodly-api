import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../entities/community.entity';
import { CreateCommunityDto } from '../dto/create-community.dto';
import { UpdateCommunityDto } from '../dto/update-community.dto';
import { CommunityMapper } from '../mapper/community.mapper';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
  ) {}

  async create(dto: CreateCommunityDto, ownerId: string) {
    const entity = CommunityMapper.fromCreateDto(dto, ownerId);
    const saved = await this.communityRepository.save(entity);
    return CommunityMapper.toResponseDto(saved);
  }

  async findOne(id: string) {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');

    return CommunityMapper.toResponseDto(community);
  }

  async update(id: string, dto: UpdateCommunityDto) {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');

    const updated = CommunityMapper.applyUpdateDto(community, dto);
    const saved = await this.communityRepository.save(updated);

    return CommunityMapper.toResponseDto(saved);
  }

  /**
   * ✅ Update with ownership check (controller expects this)
   */
  async updateWithOwnerCheck(
    id: string,
    dto: UpdateCommunityDto,
    ownerId: string,
  ) {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');
    if (community.owner.id !== ownerId) {
      throw new ForbiddenException('You are not the owner of this community');
    }

    const updated = CommunityMapper.applyUpdateDto(community, dto);
    const saved = await this.communityRepository.save(updated);

    return CommunityMapper.toResponseDto(saved);
  }

  /**
   * ✅ Remove with ownership check (controller expects this)
   */
  async removeWithOwnerCheck(id: string, ownerId: string) {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!community) throw new NotFoundException('Community not found');
    if (community.owner.id !== ownerId) {
      throw new ForbiddenException('You are not the owner of this community');
    }

    await this.communityRepository.remove(community);
  }
}
