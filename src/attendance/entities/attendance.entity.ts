// src/attendance/entities/attendance.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  RelationId,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../users/entities/user.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity()
@Index(['bookingId', 'userId', 'experienceId'], { unique: true })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' }) // optional but explicit
  booking: Booking;

  @Column()
  bookingId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Experience, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'experienceId' })
  experience: Experience;

  @Column()
  experienceId: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'present' | 'absent';

  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  @Column({ default: 'in_person' })
  method: 'virtual' | 'in_person';

  @Column()
  joinCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
