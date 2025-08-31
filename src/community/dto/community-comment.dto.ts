import { UserResponseDto } from 'src/users/dto/user-response.dto';

export interface CommunityCommentDto {
  id: string;
  content: string;
  author: UserResponseDto;
  createdAt: Date;
}
