// src/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './services/profile.service';
import { UsersModule } from 'src/users/users.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [UsersModule, CommonModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
