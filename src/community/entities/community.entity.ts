import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { CommunityMember } from './community-member.entity';
import { CommunityPost } from './community-post.entity';

@Entity('communities')
@Index(['createdAt']) // allow fast pagination/sorting by creation date
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true }) // enforce unique community names (optional)
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @ManyToOne(() => User, (user) => user.ownedCommunities, { eager: true })
  @Index() // fast filtering by owner
  owner: User;

  @OneToMany(() => CommunityMember, (member) => member.community)
  members: CommunityMember[];

  @OneToMany(() => CommunityPost, (post) => post.community)
  posts: CommunityPost[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
