// src/community/dto/community-reaction.dto.ts
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class CommunityReactionDto {
  id: string;
  type: string;
  user: UserResponseDto;
  createdAt: string;
}
