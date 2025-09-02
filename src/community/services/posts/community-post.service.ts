// src/community/services/community-post.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityPost } from '../../entities/posts/community-post.entity';
import { Community } from '../../entities/community/community.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommunityPostDto } from '../../dto/posts/community-post.dto';
import { CommunityPostMapper } from '../../mapper/posts/community-post.mapper';

@Injectable()
export class CommunityPostService {
  private readonly logger = new Logger(CommunityPostService.name);

  constructor(
    @InjectRepository(CommunityPost)
    private readonly postRepo: Repository<CommunityPost>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Community)
    private readonly communityRepo: Repository<Community>,
    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Create a new post in a community
   * Wrapped in a transaction to ensure consistency
   */
  async createPost(
    userId: string,
    communityId: string,
    content: string,
    mediaUrl?: string,
  ): Promise<CommunityPostDto | null> {
    this.logger.log(`User ${userId} creating post in community ${communityId}`);

    return this.transactionService.withTransaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const community = await manager.findOne(Community, {
        where: { id: communityId },
      });

      if (!user || !community) {
        this.logger.warn(`Cannot create post: invalid user or community`);
        return null;
      }

      const post = manager.create(CommunityPost, {
        user: user,
        author: user,
        community,
        content,
        mediaUrl,
      });
      const saved = await manager.save(post);

      this.logger.log(
        `Post ${saved.id} created successfully by user ${userId}`,
      );
      return CommunityPostMapper.toDto(saved);
    });
  }

  /**
   * List posts in a community with pagination
   */
  async listPosts(
    communityId: string,
    page = 1,
    limit = 20,
    currentUserId?: string,
  ): Promise<CommunityPostDto[]> {
    this.logger.log(
      `Fetching posts for community ${communityId}, page=${page}, limit=${limit}, user=${currentUserId}`,
    );

    const [posts, total] = await this.postRepo.findAndCount({
      where: { community: { id: communityId } },
      relations: ['author', 'comments', 'reactions', 'reactions.user'], // reactions.user is important
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    this.logger.log(`Fetched ${posts.length} posts out of total ${total}`);

    return CommunityPostMapper.toDtos(posts, currentUserId); // <-- pass user
  }

  /**
   * Get a single post by ID
   */
  async getPost(
    postId: string,
    currentUserId?: string,
  ): Promise<CommunityPostDto | null> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author', 'comments', 'reactions'],
    });
    return post ? CommunityPostMapper.toDto(post, currentUserId) : null;
  }

  /**
   * Delete a post by its author
   */
  async deletePost(userId: string, postId: string): Promise<boolean> {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author'],
    });

    if (!post) return false; // Post not found
    if (post.author.id !== userId) return false; // Not the author

    await this.postRepo.remove(post);
    this.logger.log(`Post ${postId} deleted by user ${userId}`);
    return true;
  }
}
