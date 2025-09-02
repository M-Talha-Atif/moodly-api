import { CommunityComment } from 'src/community/entities/posts/comments/community-comment.entity';
import { CommunityCommentDto } from 'src/community/dto/posts/comments/community-comment.dto';
import { UserMapper } from 'src/users/mapper/user.mapper';

export class CommunityCommentMapper {
  /**
   * Map a single comment entity to DTO
   */
  static toDto(comment: CommunityComment): CommunityCommentDto {
    if (!comment)
      throw new Error('Cannot map undefined Community Post Comment');

    return {
      id: comment.id,
      author: UserMapper.toResponseDto(comment.author),
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  /**
   * Map an array of comment entities to DTOs
   */
  static toDtos(comments: CommunityComment[]): CommunityCommentDto[] {
    return comments?.map((c) => this.toDto(c)).filter((c) => !!c) ?? [];
  }
}
