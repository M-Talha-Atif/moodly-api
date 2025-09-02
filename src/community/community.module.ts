// community.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community/community.entity';
import { CommunityMember } from './entities/community/community-member.entity';
import { CommunityPost } from './entities/posts/community-post.entity';
import { User } from 'src/users/entities/user.entity';

import { CommunityController } from './community.controller';
import { CommunityService } from './services/community/community.service';
import { CommunityQueryService } from './services/community/community-query.service';
import { CommunityMemberService } from './services/community/community-member.service';
import { CommunityPostService } from './services/posts/community-post.service';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommunityReaction } from './entities/posts/reactions/community-reaction.entity';
import { CommunityReactionService } from './services/posts/reactions/community-reaction.service';
import { CommunityCommentService } from './services/comments/community-comment.service';
import { CommunityComment } from './entities/posts/comments/community-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Community,
      CommunityMember,
      CommunityComment,
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
    CommunityCommentService,
    TransactionService,
  ],
})
export class CommunityModule {}
