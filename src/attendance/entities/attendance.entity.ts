import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';
import { User } from '../../users/entities/user.entity';
import { Experience } from '../../experience/entities/experience.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 🔑 One-to-one back-reference
  @OneToOne(() => Booking, (booking) => booking.attendance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' }) // holds FK
  booking: Booking;

  @Column()
  bookingId: string;

  // you can keep these for query convenience
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

  @Column({ nullable: true })
  qrCodeUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
