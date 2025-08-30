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
import { Experience } from 'src/experience/entities/experience.entity'; // update path if needed
import { Feedback } from '../../feedback/entities/feedback.entity';

// Enum for user roles within the system
export enum UserRole {
  USER = 'user', // Standard user (default role)
  HOST = 'host', // Host/creator of experiences or events
  ADMIN = 'admin', // Platform administrator
}

@Entity('users')
export class User {
  // Primary unique identifier (UUID ensures global uniqueness)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Unique email for login and identity
  @Column({ unique: true })
  email: string;

  // Hashed password (never store plain text)
  @Column({ name: 'password_hash' })
  passwordHash: string;

  // Optional user display name
  @Column({ nullable: true })
  name: string;

  // Optional profile picture URL
  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  // Cultural background stored as JSONB (flexible schema for ethnicity, religion, values, etc.)
  @Column({ type: 'jsonb', nullable: true })
  culturalBackground: {
    ethnicity?: string;
    religion?: string;
    values?: string[];
  };

  // Supported languages (default: English). Stored as a Postgres array.
  @Column('varchar', { array: true, default: ['en'] })
  languagePreferences: string[];

  // Preferred communication style (formal, casual, etc.)
  @Column({ name: 'communication_style', nullable: true })
  communicationStyle: string;

  // User role (enum: user, host, admin). Defaults to standard USER.
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Relationship: One host can create multiple experiences
  @OneToMany(() => Experience, (experience) => experience.host)
  experiences: Experience[];

  // Relationship: One user can make multiple bookings
  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  // Relationship: One user can give multiple feedback entries
  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  // Account status lifecycle (active, suspended, deleted)
  @Column({
    name: 'account_status',
    type: 'enum',
    enum: ['active', 'suspended', 'deleted'],
    default: 'active',
  })
  accountStatus: string;

  // Auto-generated timestamp for record creation
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Auto-generated timestamp for last update
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  // Relationship: One-to-one with privacy settings (optional)
  @OneToOne(() => PrivacySettings, (ps) => ps.user, { nullable: true })
  @JoinColumn()
  privacySettings: PrivacySettings;
}
