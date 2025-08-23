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

/**
 * Attendance entity representing a user's participation
 * in an experience, tied to a specific booking.
 */
@Entity()
export class Attendance {
  /**
   * Unique identifier for the attendance record (UUID).
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * One-to-one relationship with Booking.
   * Each booking can have at most one attendance record.
   * Cascade delete ensures that when a booking is removed,
   * its attendance record is also deleted.
   */
  @OneToOne(() => Booking, (booking) => booking.attendance, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bookingId' }) // Explicit FK column
  booking: Booking;

  /**
   * Foreign key reference to the related booking.
   */
  @Column()
  bookingId: string;

  /**
   * Many-to-one relationship with User.
   * A user can have multiple attendance records.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Foreign key reference to the related user.
   */
  @Column()
  userId: string;

  /**
   * Many-to-one relationship with Experience.
   * Multiple attendances can be tied to a single experience.
   */
  @ManyToOne(() => Experience, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'experienceId' })
  experience: Experience;

  /**
   * Foreign key reference to the related experience.
   */
  @Column()
  experienceId: string;

  /**
   * Attendance status.
   * Defaults to "pending" until check-in/out is completed.
   */
  @Column({ default: 'pending' })
  status: 'pending' | 'present' | 'absent';

  /**
   * Timestamp marking when the user checked in.
   */
  @Column({ type: 'timestamp', nullable: true })
  checkInTime: Date;

  /**
   * Timestamp marking when the user checked out.
   */
  @Column({ type: 'timestamp', nullable: true })
  checkOutTime: Date;

  /**
   * Method of attendance.
   * Can be "virtual" (remote) or "in_person" (physical).
   * Defaults to "in_person".
   */
  @Column({ default: 'in_person' })
  method: 'virtual' | 'in_person';

  /**
   * Unique join code used for validating attendance entry.
   */
  @Column()
  joinCode: string;

  /**
   * Optional QR code URL for quick check-in/out scanning.
   */
  @Column({ nullable: true })
  qrCodeUrl?: string;

  /**
   * Record creation timestamp (automatically managed).
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Record last update timestamp (automatically managed).
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
