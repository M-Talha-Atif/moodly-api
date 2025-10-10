import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { ResultDto } from 'src/common/dto/result.dto';
import { S3Service } from 'src/common/services/s3.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);

    const result = {
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
      accountStatus: user.accountStatus,
    };

    return ResultDto.ok(result, 'Profile fetched successfully');
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    let avatarUrl = dto.avatarUrl;

    // If a file is uploaded, upload to S3
    if (file) {
      avatarUrl = await this.s3Service.uploadBuffer(
        file.buffer,
        file.originalname,
        file.mimetype,
      );
    }

    //  Build DTO for update (avoid passing entity)
    const updateUserDto = {
      ...(dto.name && { name: dto.name }),
      ...(avatarUrl && { avatarUrl }),
    };

    await this.usersService.update(userId, updateUserDto);

    return ResultDto.okWithMessage('Profile updated successfully');
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.usersService.findOne(userId);

    if (!user.passwordHash) {
      return ResultDto.fail(
        'Password cannot be changed for this account',
        400,
        'NO_PASSWORD_ACCOUNT',
      );
    }

    const match = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!match) {
      return ResultDto.fail(
        'Incorrect old password',
        400,
        'INVALID_OLD_PASSWORD',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.update(userId, { passwordHash: hashedPassword });

    return ResultDto.okWithMessage('Password updated successfully');
  }
}
