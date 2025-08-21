import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity('pending_feedback')
export class PendingFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { primary: true })
  userId: string;

  @Column('uuid', { primary: true })
  experienceId: string;

  @Column() // Add this column to store the experience title
  experienceTitle: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Experience, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'experienceId' })
  experience: Experience;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
