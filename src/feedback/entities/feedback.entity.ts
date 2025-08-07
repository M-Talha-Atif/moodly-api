// src/feedback/entities/feedback.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  comment: string;

  @Column('int')
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  // Explicit column definition - must match DB exactly
  @Column({ name: 'userId', type: 'uuid', nullable: false })
  userId: string;

  // Explicit column definition - must match DB exactly
  @Column({ name: 'experienceId', type: 'uuid', nullable: false })
  experienceId: string;

  // Relation definition
  @ManyToOne(() => User, (user) => user.feedbacks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // This links the relation to the column
  user: User;

  // Relation definition
  @ManyToOne(() => Experience, (experience) => experience.feedbacks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'experienceId' }) // This links the relation to the column
  experience: Experience;
}