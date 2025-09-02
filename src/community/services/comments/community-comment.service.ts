import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunityComment } from 'src/community/entities/posts/comments/community-comment.entity';
import { CommunityPost } from 'src/community/entities/posts/community-post.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionService } from 'src/common/services/transaction.service';
import { CommunityCommentDto } from 'src/community/dto/posts/comments/community-comment.dto';
import { CommunityCommentMapper } from 'src/community/mapper/posts/comments/community-comment.mapper';

@Injectable()
export class CommunityCommentService {
  private readonly logger = new Logger(CommunityCommentService.name);

  constructor(
    @InjectRepository(CommunityComment)
    private readonly commentRepo: Repository<CommunityComment>,

    @InjectRepository(CommunityPost)
    private readonly postRepo: Repository<CommunityPost>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly transactionService: TransactionService,
  ) {}

  /**
   * Create a comment on a post
   */
  async addComment(
    userId: string,
    postId: string,
    content: string,
  ): Promise<CommunityCommentDto | null> {
    return this.transactionService.withTransaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      const post = await manager.findOne(CommunityPost, {
        where: { id: postId },
      });

      if (!user || !post) {
        this.logger.warn(
          `Cannot add comment: invalid user (${userId}) or post (${postId})`,
        );
        return null;
      }

      const comment = manager.create(CommunityComment, {
        author: user,
        post,
        content,
      });

      const saved = await manager.save(comment);
      return CommunityCommentMapper.toDto(saved);
    });
  }

  /**
   * List all comments for a post
   */
  async listComments(postId: string): Promise<CommunityCommentDto[]> {
    const comments = await this.commentRepo.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'ASC' }, // oldest first
    });

    return CommunityCommentMapper.toDtos(comments);
  }

  /**
   * Delete a comment (only author can delete)
   */
  async deleteComment(userId: string, commentId: string): Promise<boolean> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
      relations: ['author'],
    });

    if (!comment) return false; // not found
    if (comment.author.id !== userId) return false; // not author

    await this.commentRepo.remove(comment);
    this.logger.log(`Comment ${commentId} deleted by user ${userId}`);
    return true;
  }
}
