import { ApiProperty } from '@nestjs/swagger';

export class CommunityListItemDto {
  @ApiProperty({ example: '1a2b3c4d' })
  id: string;

  @ApiProperty({ example: 'NestJS Developers' })
  name: string;

  @ApiProperty({ example: 'https://example.com/cover.jpg', required: false })
  coverImageUrl?: string;

  @ApiProperty({ example: 'Technology' })
  category: string;

  @ApiProperty({ example: false })
  isPrivate: boolean;

  @ApiProperty({ example: 152 })
  membersCount: number;
}
