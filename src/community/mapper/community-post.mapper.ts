// src/community/mapper/community-post.mapper.ts
import { CommunityPost } from '../entities/community-post.entity';
import { CommunityPostDto } from '../dto/community-post.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class CommunityPostMapper {
  /**
   * Map a single CommunityPost entity to DTO
   */
  static toDto = (entity: CommunityPost): CommunityPostDto => {
    if (!entity) {
      throw new Error('Cannot map undefined CommunityPost');
    }

    return {
      id: entity.id,
      author: UserMapper.toResponseDto(entity.author),
      content: entity.content,
      mediaUrl: entity.mediaUrl,
      createdAt: entity.createdAt,
      comments: entity.comments?.map(
        (c) =>
          c && {
            id: c.id,
            content: c.content,
            author: UserMapper.toResponseDto(c.author),
            createdAt: c.createdAt,
          },
      ),
      reactions: entity.reactions?.map(
        (r) =>
          r && {
            id: r.id,
            type: r.type,
            user: UserMapper.toResponseDto(r.user),
            createdAt: r.createdAt,
          },
      ),
    };
  };

  /**
   * Map an array of CommunityPost entities to DTOs
   */
  static toDtos = (entities: CommunityPost[]): CommunityPostDto[] =>
    entities
      ?.map((e) => this.toDto(e))
      .filter((e): e is CommunityPostDto => !!e) ?? [];
}
