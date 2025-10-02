import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { PrivacySettings } from './privacy.entity';
import { Experience } from 'src/experience/entities/experience.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import {
  UserRole,
  AuthProvider,
  AccountStatus,
} from 'src/common/enums/user.enums';
import { Community } from 'src/community/entities/community/community.entity';
import { CommunityPost } from 'src/community/entities/posts/community-post.entity';
import { CommunityComment } from 'src/community/entities/posts/comments/community-comment.entity';
import { CommunityReaction } from 'src/community/entities/posts/reactions/community-reaction.entity';
import { CommunityMember } from 'src/community/entities/community/community-member.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', nullable: true })
  passwordHash?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  onboardingCompleted: boolean;

  @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
  provider: AuthProvider;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  culturalBackground: {
    ethnicity?: string;
    religion?: string;
    values?: string[];
  };

  @Column('varchar', { array: true, default: ['en'] })
  languagePreferences: string[];

  @Column({ name: 'communication_style', nullable: true })
  communicationStyle: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Experience, (experience) => experience.host)
  experiences: Experience[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  // Reverse relations with community
  @OneToMany(() => Community, (community) => community.owner)
  ownedCommunities: Community[];

  @OneToMany(() => CommunityPost, (post) => post.author)
  posts: CommunityPost[];

  @OneToMany(() => CommunityComment, (comment) => comment.author)
  comments: CommunityComment[];

  @OneToMany(() => CommunityReaction, (reaction) => reaction.user)
  reactions: CommunityReaction[];

  @OneToMany(() => CommunityMember, (member) => member.user)
  communityMemberships: CommunityMember[];

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @OneToOne(() => PrivacySettings, (ps) => ps.user)
  privacySettings: PrivacySettings;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
