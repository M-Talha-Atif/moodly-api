// community.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { CommunityMember } from './entities/community-member.entity';
import { CommunityPost } from './entities/community-post.entity';
import { User } from 'src/users/entities/user.entity';

import { CommunityController } from './community.controller';
import { CommunityService } from './services/community.service';
import { CommunityQueryService } from './services/community-query.service';
import { CommunityMemberService } from './services/community-member.service';
import { CommunityPostService } from './services/community-post.service';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommunityReaction } from './entities/community-reaction.entity';
import { CommunityReactionService } from './services/community-reaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Community,
      CommunityMember,
      CommunityPost,
      User,
      CommunityReaction,
    ]),
  ],
  controllers: [CommunityController],
  providers: [
    CommunityService,
    CommunityQueryService,
    CommunityMemberService,
    CommunityPostService,
    CommunityReactionService,
    TransactionService,
  ],
})
export class CommunityModule {}
