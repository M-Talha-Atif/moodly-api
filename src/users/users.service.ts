// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrivacySettings } from './entities/privacy.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(PrivacySettings)
    private privacyRepository: Repository<PrivacySettings>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Create and save user first, without privacy settings
    const user = this.usersRepository.create({
      email: createUserDto.email,
      passwordHash: createUserDto.passwordHash,
      name: createUserDto.name,
      avatarUrl: createUserDto.avatarUrl,
      culturalBackground: createUserDto.culturalBackground,
      languagePreferences: createUserDto.languagePreferences,
      communicationStyle: createUserDto.communicationStyle,
      role: createUserDto.role,
    });

    const savedUser = await this.usersRepository.save(user);

    // 2. Then, create and save privacy settings separately
    if (createUserDto.privacySettings) {
      const ps = this.privacyRepository.create({
        dataSharingLevel:
          createUserDto.privacySettings.dataSharingLevel || 'balanced',
        communityVisibility:
          createUserDto.privacySettings.communityVisibility || 'connections',
        trackingConsent: createUserDto.privacySettings.trackingConsent ?? false,
        user: savedUser,
      });

      const savedPrivacy = await this.privacyRepository.save(ps);

      // 3. Attach privacy settings to user and return updated user
      savedUser.privacySettings = savedPrivacy;
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['privacySettings'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['privacySettings'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['privacySettings'],
      select: includePassword
        ? undefined // Select all, including passwordHash
        : [
            'id',
            'email',
            'name',
            'avatarUrl',
            'culturalBackground',
            'languagePreferences',
            'communicationStyle',
            'role',
            'accountStatus',
            'createdAt',
            'updatedAt',
          ],
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['privacySettings', 'experiences'],
    });
  }
}
