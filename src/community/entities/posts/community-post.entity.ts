import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Community } from '../community/community.entity';
import { CommunityComment } from './comments/community-comment.entity';
import { CommunityReaction } from './reactions/community-reaction.entity';

@Entity('community_posts')
export class CommunityPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Community, (community) => community.posts)
  community: Community;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: true })
  mediaUrl: string;

  @OneToMany(() => CommunityComment, (comment) => comment.post)
  comments: CommunityComment[];

  @OneToMany(() => CommunityReaction, (reaction) => reaction.post)
  reactions: CommunityReaction[];

  @CreateDateColumn()
  createdAt: Date;
}
