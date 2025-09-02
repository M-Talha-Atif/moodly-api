// src/community/services/community-reaction.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityReaction } from '../../../entities/posts/reactions/community-reaction.entity';
import { CommunityPost } from '../../../entities/posts/community-post.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommunityReactionDto } from '../../../dto/posts/reactions/community-reaction.dto';
import { CommunityReactionMapper } from '../../../mapper/posts/reaction/community-reaction.mapper';

@Injectable()
export class CommunityReactionService {
  private readonly logger = new Logger(CommunityReactionService.name);

  constructor(
    @InjectRepository(CommunityReaction)
    private readonly reactionRepo: Repository<CommunityReaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CommunityPost)
    private readonly postRepo: Repository<CommunityPost>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Add or update reaction (idempotent)
   */
  async upsertReaction(
    userId: string,
    postId: string,
    type: string,
  ): Promise<CommunityReactionDto | null> {
    return this.transactionService.withTransaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const post = await manager.findOne(CommunityPost, {
        where: { id: postId },
      });

      if (!user || !post) return null;

      let reaction = await manager.findOne(CommunityReaction, {
        where: { post: { id: postId }, user: { id: userId } },
        relations: ['user'],
      });

      if (reaction) {
        // update existing reaction
        reaction.type = type;
      } else {
        // create new reaction
        reaction = manager.create(CommunityReaction, { post, user, type });
      }

      const saved = await manager.save(reaction);
      this.logger.log(
        `User ${userId} set reaction "${type}" on post ${postId}`,
      );
      return CommunityReactionMapper.toDto(saved);
    });
  }

  /**
   * Remove a reaction (regardless of type)
   */
  async removeReaction(userId: string, postId: string): Promise<boolean> {
    const reaction = await this.reactionRepo.findOne({
      where: { post: { id: postId }, user: { id: userId } },
    });

    if (!reaction) return false;
    await this.reactionRepo.remove(reaction);
    this.logger.log(`User ${userId} removed reaction from post ${postId}`);
    return true;
  }

  async listReactions(postId: string, userId?: string) {
    // 1. Aggregate counts at DB level
    const rawSummary = await this.reactionRepo
      .createQueryBuilder('reaction')
      .innerJoin('reaction.post', 'post') // explicit join
      .select('reaction.type', 'type')
      .addSelect('COUNT(reaction.id)', 'count')
      .where('post.id = :postId', { postId })
      .groupBy('reaction.type')
      .getRawMany<{ type: string; count: string }>();

    const summary = rawSummary.reduce<Record<string, number>>((acc, row) => {
      acc[row.type] = parseInt(row.count, 10);
      return acc;
    }, {});

    // 2. Fetch current user’s reaction if provided
    let userReaction: string | null = null;
    if (userId) {
      const reaction = await this.reactionRepo
        .createQueryBuilder('reaction')
        .innerJoin('reaction.post', 'post')
        .innerJoin('reaction.user', 'user')
        .select('reaction.type', 'type')
        .where('post.id = :postId', { postId })
        .andWhere('user.id = :userId', { userId })
        .getRawOne<{ type: string }>();

      userReaction = reaction?.type ?? null;
    }

    return { summary, userReaction };
  }
}
