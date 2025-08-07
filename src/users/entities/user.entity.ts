import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { PrivacySettings } from './privacy.entity';
import { Experience } from 'src/experience/entities/experience.entity'; // update path if needed
import { OneToMany } from 'typeorm';
import { Feedback } from '../../feedback/entities/feedback.entity';

export enum UserRole {
  USER = 'user',
  HOST = 'host',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ nullable: true })
  name: string;

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Experience, (experience) => experience.host)
  experiences: Experience[];

  // Add to User entity
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  @Column({
    name: 'account_status',
    type: 'enum',
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  })
  accountStatus: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToOne(() => PrivacySettings, (ps) => ps.user, { nullable: true })
  @JoinColumn()
  privacySettings: PrivacySettings;
}
