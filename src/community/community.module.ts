import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityService } from './services/community.service';
import { CommunityQueryService } from './services/community-query.service';
import { CommunityMemberService } from './services/community-member.service';
import { CommunityMember } from './entities/community-member.entity';
import { User } from 'src/users/entities/user.entity';
import { CommunityController } from './community.controller';
import { TransactionService } from 'src/common/services/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Community, CommunityMember, User])],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityQueryService,
    CommunityMemberService,
    TransactionService,
  ],
})
export class CommunityModule {}
