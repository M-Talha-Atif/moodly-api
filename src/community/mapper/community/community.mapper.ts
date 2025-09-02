import { Community } from '../../entities/community/community.entity';
import { CommunityListItemDto } from '../../dto/community-list-item.dto';
import { CommunityResponseDto } from '../../dto/community-response.dto';
import { CreateCommunityDto } from '../../dto/create-community.dto';
import { UpdateCommunityDto } from '../../dto/update-community.dto';
import { User } from '../../../users/entities/user.entity';
import { UserMapper } from '../../../users/mapper/user.mapper';

export class CommunityMapper {
  static toListItemDto(entity: Community): CommunityListItemDto {
    return {
      id: entity.id,
      name: entity.name,
      coverImageUrl: entity.coverImageUrl ?? undefined,
      category: entity.category,
      isPrivate: entity.isPrivate,
      membersCount: entity.memberCount ?? entity.members?.length ?? 0,
    };
  }

  static toResponseDto(entity: Community): CommunityResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description ?? undefined,
      coverImageUrl: entity.coverImageUrl ?? undefined,
      category: entity.category,
      isPrivate: entity.isPrivate,
      rules: entity.rules ?? undefined,
      location: entity.location ?? undefined,
      tags: entity.tags ?? [],
      memberCount: entity.memberCount ?? entity.members?.length ?? 0,
      owner: UserMapper.toResponseDto(entity.owner),
      members:
        entity.members?.map((m) => UserMapper.toResponseDto(m.user)) ?? [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromCreateDto(dto: CreateCommunityDto, ownerId: string): Community {
    const community = new Community();
    community.name = dto.name;
    community.description = dto.description ?? null;
    community.coverImageUrl = dto.coverImageUrl ?? null;
    community.category = dto.category;
    community.isPrivate = dto.isPrivate ?? false;
    community.rules = dto.rules ?? null;
    community.location = dto.location ?? null;
    community.tags = dto.tags ?? [];
    community.owner = { id: ownerId } as User;
    community.memberCount = 1; // owner counts as first member
    return community;
  }

  static applyUpdateDto(entity: Community, dto: UpdateCommunityDto): Community {
    if (dto.name !== undefined) entity.name = dto.name;
    if (dto.description !== undefined)
      entity.description = dto.description ?? null;
    if (dto.coverImageUrl !== undefined)
      entity.coverImageUrl = dto.coverImageUrl ?? null;
    if (dto.category !== undefined) entity.category = dto.category;
    if (dto.isPrivate !== undefined) entity.isPrivate = dto.isPrivate;
    if (dto.rules !== undefined) entity.rules = dto.rules ?? null;
    if (dto.location !== undefined) entity.location = dto.location ?? null;
    if (dto.tags !== undefined) entity.tags = dto.tags;
    return entity;
  }
}
