// src/booking/entities/booking.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity()
@Index(['experience', 'user'], { unique: true }) // Prevent duplicate bookings
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Experience, (experience) => experience.bookings, {
    onDelete: 'CASCADE',
  })
  experience: Experience;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @Column({ default: 'confirmed' })
  status: 'confirmed' | 'cancelled' | 'waitlisted';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
