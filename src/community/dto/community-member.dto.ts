// src/community/dto/community-member.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class CommunityMemberDto {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: '2025-08-31T18:00:00.000Z' })
  joinedAt: Date;
}
