import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityMember } from '../../entities/community/community-member.entity';
import { User } from 'src/users/entities/user.entity';
import { Community } from '../../entities/community/community.entity';
import { CommunityMemberMapper } from '../../mapper/community/community-member.mapper';
import { CommunityMemberDto } from '../../dto/community-member.dto';
import { TransactionService } from 'src/common/services/transaction.service';

@Injectable()
export class CommunityMemberService {
  private readonly logger = new Logger(CommunityMemberService.name);

  constructor(
    @InjectRepository(CommunityMember)
    private readonly memberRepo: Repository<CommunityMember>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * User joins a community (transactional)
   * - Wrapped in a transaction to prevent race conditions when two requests try to join the same user at the same time
   * - Logs each step for monitoring
   */
  async joinCommunity(
    userId: string,
    communityId: string,
  ): Promise<CommunityMemberDto | null> {
    this.logger.log(
      `User ${userId} attempting to join community ${communityId}`,
    );

    return this.transactionService.withTransaction(async (manager) => {
      // Fetch user and community
      const user = await manager.findOne(User, { where: { id: userId } });
      const community = await manager.findOne(Community, {
        where: { id: communityId },
      });

      if (!user || !community) {
        this.logger.warn(
          `User or community not found: user=${userId}, community=${communityId}`,
        );
        return null;
      }

      // Check if already a member to prevent duplicate entries
      const existing = await manager.findOne(CommunityMember, {
        where: { user: { id: userId }, community: { id: communityId } },
      });
      if (existing) {
        this.logger.warn(
          `User ${userId} already a member of community ${communityId}`,
        );
        return null;
      }

      // Create membership
      const membership = manager.create(CommunityMember, { user, community });
      const saved = await manager.save(membership);
      this.logger.log(
        `User ${userId} successfully joined community ${communityId}`,
      );

      return CommunityMemberMapper.toDto(saved);
    });
  }

  /**
   * User leaves a community (transactional)
   * - Ensures atomic deletion
   * - Logs every step
   */
  async leaveCommunity(userId: string, communityId: string): Promise<boolean> {
    this.logger.log(
      `User ${userId} attempting to leave community ${communityId}`,
    );

    return this.transactionService.withTransaction(async (manager) => {
      const membership = await manager.findOne(CommunityMember, {
        where: { user: { id: userId }, community: { id: communityId } },
      });

      if (!membership) {
        this.logger.warn(
          `Membership not found for user=${userId} community=${communityId}`,
        );
        return false;
      }

      await manager.remove(membership);
      this.logger.log(
        `User ${userId} successfully left community ${communityId}`,
      );
      return true;
    });
  }

  /**
   * List all members of a community
   *
   * Previous implementation issues:
   * - Used `find` with eager-loaded relations, which can trigger N+1 queries if users have nested relations
   * - No pagination: could load thousands of members at once
   *
   * Improvements:
   * 1. Uses QueryBuilder with JOIN to fetch all required data in a single query (avoids N+1 problem)
   * 2. Supports pagination to prevent memory issues on large communities
   * 3. Orders by joinedAt to provide consistent results
   */
  async listMembers(
    communityId: string,
    page = 1,
    limit = 50, // default page size
  ): Promise<CommunityMemberDto[]> {
    this.logger.log(
      `Listing members for community ${communityId}, page=${page}, limit=${limit}`,
    );

    const [members, total] = await this.memberRepo
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.user', 'user') // JOIN user once
      .where('member.communityId = :communityId', { communityId })
      .orderBy('member.joinedAt', 'ASC') // optional ordering
      .skip((page - 1) * limit) // pagination offset
      .take(limit) // pagination limit
      .getManyAndCount(); // returns [entities, totalCount]

    this.logger.log(`Fetched ${members.length} members out of total ${total}`);

    return CommunityMemberMapper.toDtos(members);
  }
}
