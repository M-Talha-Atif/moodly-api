import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  RelationId,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
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
  experienceId: string; // 👈 Add this

  @ManyToOne(() => User, (user) => user.bookings)
  user: User;

  @RelationId((booking: Booking) => booking.user)
  userId: string; // 👈 And this

  @Column({ default: 'confirmed' })
  status: 'confirmed' | 'cancelled' | 'waitlisted';

  @Column({ nullable: true })
  cancelledAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
