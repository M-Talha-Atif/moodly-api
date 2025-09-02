import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class CommunityCommentDto {
  id: string;
  content: string;
  author: UserResponseDto;
  createdAt: string;
}
