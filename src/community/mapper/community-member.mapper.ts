// src/community/mapper/community-member.mapper.ts
import { CommunityMember } from '../entities/community-member.entity';
import { CommunityMemberDto } from '../dto/community-member.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class CommunityMemberMapper {
  /**
   * Maps a CommunityMember entity to DTO
   * Returns undefined if the entity is null/undefined
   */
  static toDto(entity: CommunityMember): CommunityMemberDto {
    if (!entity) throw new Error('Cannot map undefined CommunityMember');

    return {
      id: entity.id,
      user: UserMapper.toResponseDto(entity.user),
      joinedAt: entity.joinedAt,
    };
  }

  /**
   * Maps an array of CommunityMember entities to DTOs
   */
  static toDtos = (entities: CommunityMember[]): CommunityMemberDto[] =>
    entities
      ?.map((e) => this.toDto(e))
      .filter((e): e is CommunityMemberDto => !!e) ?? [];
}
