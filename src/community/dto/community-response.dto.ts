import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class CommunityResponseDto {
  @ApiProperty({ example: '1a2b3c4d' })
  id: string;

  @ApiProperty({ example: 'NestJS Developers' })
  name: string;

  @ApiProperty({
    example: 'A community for NestJS backend developers',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  coverImageUrl?: string;

  @ApiProperty({ type: () => UserResponseDto })
  owner: UserResponseDto;

  @ApiProperty({ type: () => [UserResponseDto] })
  members: UserResponseDto[];

  @ApiProperty({ example: '2025-08-31T12:34:56.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-08-31T12:34:56.000Z' })
  updatedAt: Date;
}
