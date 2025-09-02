// src/community/dto/community-post.dto.ts
import { CommunityCommentDto } from './comments/community-comment.dto';
import { CommunityReactionDto } from './reactions/community-reaction.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class CommunityPostDto {
  id: string;
  author: UserResponseDto;
  content: string;
  mediaUrl?: string;
  createdAt: string;
  comments?: CommunityCommentDto[];
  reactions?: CommunityReactionDto[];
  userReaction?: string; // e.g., "like", "love"
  isOwner?: boolean; // Indicates if the current user is the author
}
