// src/community/dto/community-reaction.dto.ts
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export interface CommunityReactionDto {
  id: string;
  type: string; // or enum if you have one
  user: UserResponseDto;
  createdAt: Date;
}
