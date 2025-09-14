import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MoodLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  moodLabel: string; // stores values like 'happy', 'sad', etc.

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ nullable: true })
  textSentiment: string;

  @Column({ nullable: true })
  photoEmotion: string;

  @Column({ type: 'text', nullable: true })
  voiceTranscript: string;

  @Column({ nullable: true })
  voiceSentiment: string;

  @Column({ default: false })
  sameAsYesterday: boolean;

  @Column({ nullable: true })
  finalMood: string;

  @CreateDateColumn()
  createdAt: Date;
}
