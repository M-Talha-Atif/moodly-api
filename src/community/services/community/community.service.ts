import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Community } from '../../entities/community/community.entity';
import { CreateCommunityDto } from '../../dto/create-community.dto';
import { UpdateCommunityDto } from '../../dto/update-community.dto';
import { CommunityMapper } from '../../mapper/community/community.mapper';
import { ClientProxy } from '@nestjs/microservices';
import { RMQ_DOMAINS } from 'src/config/rmq.constants';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @Inject(RMQ_DOMAINS.COMMUNITY.CLIENT)
    private readonly communityClient: ClientProxy,
  ) {}

  async create(dto: CreateCommunityDto, ownerId: string) {
    const entity = CommunityMapper.fromCreateDto(dto, ownerId);
    const saved = await this.communityRepository.save(entity);

    // emit background job
    this.communityClient.emit(RMQ_DOMAINS.COMMUNITY.ROUTING.EMBED, {
      communityId: saved.id,
      name: saved.name,
      description: saved.description,
      category: saved.category,
      tags: saved.tags,
      rules: saved.rules,
      location: saved.location,
    });

    return CommunityMapper.toResponseDto(saved);
  }

  async findOne(id: string) {
    const community = await this.communityRepository.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user', 'posts'],
    });

    if (!community) throw new NotFoundException('Community not found');

    // ensure memberCount is in sync
    community.memberCount = community.members?.length ?? 0;

    return CommunityMapper.toResponseDto(community);
  }

  async findAll() {
    const communities = await this.communityRepository.find({
      relations: ['members'],
      order: { createdAt: 'DESC' },
    });

    // sync memberCount for all communities
    communities.forEach(
      (c) => (c.memberCount = c.members?.length ?? c.memberCount ?? 0),
    );

    return communities.map((c) => CommunityMapper.toListItemDto(c));
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
   * Update with ownership check (controller expects this)
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
   * Remove with ownership check (controller expects this)
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
