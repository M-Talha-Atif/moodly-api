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
import { CommunityPost } from '../posts/community-post.entity';

@Entity('communities')
@Index(['createdAt'])
@Index(['category'])
export class Community {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'varchar', length: 100 })
  category: string; // community category

  @Column({ default: false })
  isPrivate: boolean; //  private vs public

  @Column({ type: 'text', nullable: true })
  rules: string | null; // community rules/guidelines

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string | null; // optional location

  @Column('simple-array', { nullable: true })
  tags: string[] | null; // searchable tags

  @Column({ default: 0 })
  memberCount: number; // denormalized for quick queries

  @ManyToOne(() => User, (user) => user.ownedCommunities, { eager: true })
  @Index()
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
