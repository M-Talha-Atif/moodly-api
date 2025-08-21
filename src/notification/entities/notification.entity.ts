import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  message?: string;

  @Column({ default: false })
  read: boolean;

  @Column({ default: 'general' }) // daily check in
  type: string;

  @CreateDateColumn()
  createdAt: Date;
}
