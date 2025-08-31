import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';

export class UserMapper {
  static toResponseDto(entity: User): UserResponseDto {
    return {
      id: entity.id,
      username: entity.name,
      email: entity.email,
    };
  }
}
