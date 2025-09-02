import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Community } from './community.entity';

@Entity('community_members')
@Unique(['user', 'community']) // prevent duplicate joins
export class CommunityMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.communityMemberships, { eager: true })
  user: User;

  @ManyToOne(() => Community, (community) => community.members, { eager: true })
  community: Community;

  @CreateDateColumn()
  joinedAt: Date;
}
