import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommunityPost } from './community-post.entity';

@Entity('community_reactions')
export class CommunityReaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => CommunityPost, (post) => post.reactions)
  post: CommunityPost;

  @ManyToOne(() => User, (user) => user.reactions, { eager: true })
  user: User;

  @Column()
  type: string; // like, love, etc.

  @CreateDateColumn()
  createdAt: Date;
}
