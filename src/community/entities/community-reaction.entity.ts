import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommunityPost } from './community-post.entity';

@Entity('community_reactions')
@Unique(['post', 'user']) // ensures 1 reaction per user per post
export class CommunityReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CommunityPost, (post) => post.reactions, {
    onDelete: 'CASCADE',
  })
  post: CommunityPost;

  @ManyToOne(() => User, (user) => user.reactions, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  type: string; // "like", "love", "haha", etc.

  @CreateDateColumn()
  createdAt: Date;
}
