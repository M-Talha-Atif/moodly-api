// src/community/dto/community-post.dto.ts
import { CommunityCommentDto } from './community-comment.dto';
import { CommunityReactionDto } from './community-reaction.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export interface CommunityPostDto {
  id: string;
  author: UserResponseDto;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  comments?: CommunityCommentDto[];
  reactions?: CommunityReactionDto[];
}
