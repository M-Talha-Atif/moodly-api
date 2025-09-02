// src/community/mapper/community-post.mapper.ts
import { CommunityPost } from '../../entities/posts/community-post.entity';
import { CommunityPostDto } from '../../dto/posts/community-post.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class CommunityPostMapper {
  /**
   * Map a single CommunityPost entity to DTO
   */
  static toDto = (
    entity: CommunityPost,
    currentUserId?: string,
  ): CommunityPostDto => {
    if (!entity) throw new Error('Cannot map undefined CommunityPost');

    // Reactions summary
    const reactions =
      entity.reactions?.map((r) => ({
        id: r.id,
        type: r.type,
        user: UserMapper.toResponseDto(r.user),
        createdAt: r.createdAt.toISOString(),
      })) || [];

    // Reactions by current user
    const userReaction = currentUserId
      ? entity.reactions?.find((r) => r.user.id === currentUserId)?.type
      : undefined;

    return {
      id: entity.id,
      author: UserMapper.toResponseDto(entity.author),
      content: entity.content,
      mediaUrl: entity.mediaUrl,
      createdAt: entity.createdAt.toISOString(),
      comments:
        entity.comments?.map((c) => ({
          id: c.id,
          content: c.content,
          author: UserMapper.toResponseDto(c.author),
          createdAt: c.createdAt.toISOString(),
        })) || [],
      reactions,
      userReaction,
      isOwner: currentUserId ? entity.author.id === currentUserId : false,
    };
  };

  /**
   * Map an array of CommunityPost entities to DTOs
   */
  static toDtos = (
    entities: CommunityPost[],
    currentUserId?: string,
  ): CommunityPostDto[] =>
    entities
      ?.map((e) => this.toDto(e, currentUserId)) // <-- forward user id
      .filter((e): e is CommunityPostDto => !!e) ?? [];
}
