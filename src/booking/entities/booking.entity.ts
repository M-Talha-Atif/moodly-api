import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity()
@Index(['experience', 'user'], { unique: true })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Experience, (experience) => experience.bookings, {
    onDelete: 'CASCADE',
  })
  experience: Experience;

  @RelationId((booking: Booking) => booking.experience)
  experienceId: string;

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @RelationId((booking: Booking) => booking.user)
  userId: string;

  // 🔑 One-to-one relation with Attendance
  @OneToOne(() => Attendance, (attendance) => attendance.booking, {
    cascade: true,
  })
  @JoinColumn() // 👈 required on one side of 1:1 to store FK
  attendance: Attendance;

  @Column({ default: 'confirmed' })
  status: 'confirmed' | 'cancelled' | 'waitlisted';

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
