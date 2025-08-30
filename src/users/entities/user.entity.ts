import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
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

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  accountStatus: AccountStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => PrivacySettings, (ps) => ps.user, { nullable: true })
  @JoinColumn()
  privacySettings: PrivacySettings;
}
