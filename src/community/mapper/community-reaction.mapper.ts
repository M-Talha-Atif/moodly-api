// src/community/mapper/community-reaction.mapper.ts
import { CommunityReaction } from '../entities/community-reaction.entity';
import { CommunityReactionDto } from '../dto/community-reaction.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class CommunityReactionMapper {
  static toDto = (entity: CommunityReaction): CommunityReactionDto => {
    if (!entity) throw new Error('Cannot map undefined CommunityReaction');
    return {
      id: entity.id,
      type: entity.type,
      user: UserMapper.toResponseDto(entity.user),
      createdAt: entity.createdAt,
    };
  };

  static toDtos = (entities: CommunityReaction[]): CommunityReactionDto[] =>
    entities
      ?.map((e) => this.toDto(e))
      .filter((e): e is CommunityReactionDto => !!e) ?? [];
}
