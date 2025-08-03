import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  location: string;

  @Column()
  image: string;

  @Column()
  isVirtual: boolean;

  @Column({ type: 'timestamp' })
  sessionStartTime: Date;

  @Column({ type: 'timestamp' })
  sessionEndTime: Date;

  @Column()
  price: number;

  @Column()
  timezone: string;

  @Column()
  totalSpots: number;

  @Column({ default: 0 })
  spotsFilled: number;

  @Column({ nullable: true })
  meetingLink: string;

  @Column({ nullable: true })
  cancellationPolicy: string;

  @Column('jsonb', { nullable: true })
  aiPrep: any;

  @Column('jsonb', { nullable: true })
  testimonials: any;

  @Column('jsonb', { nullable: true })
  preparation: any;

  // 🔥 Emotional Matching Fields
  @Column('simple-array', { nullable: true })
  targetEmotions: string[];

  @Column('simple-array', { nullable: true })
  desiredOutcomes: string[];

  // 🌍 Cultural Context
  @Column({ nullable: true })
  language: string;

  @Column('simple-array', { nullable: true })
  culturalTags: string[];

  // 📈 Growth & Outcomes
  @Column('jsonb', { nullable: true })
  growthDimensions: any;

  @Column({ type: 'text', nullable: true })
  experienceOutcomeSummary: string;

  // 👥 Community / Matchmaking
  @Column('simple-array', { nullable: true })
  idealParticipantTraits: string[];

  // 📊 AI Engagement Stats
  @Column('jsonb', { nullable: true })
  engagementStats: any;

  // 👤 Host (Relation)
  @ManyToOne(() => User, (user) => user.experiences, { eager: false })
  host: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
