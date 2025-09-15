// src/users/entities/privacy.entity.ts
import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from './user.entity';

@Entity('privacy_settings')
export class PrivacySettings {
  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @OneToOne(() => User, (user) => user.privacySettings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' }) // Owning side
  @Exclude()
  user: User;

  @Column({
    name: 'data_sharing_level',
    type: 'enum',
    enum: ['minimal', 'balanced', 'full'],
    default: 'balanced',
  })
  dataSharingLevel: string;

  @Column({
    name: 'community_visibility',
    type: 'enum',
    enum: ['private', 'connections', 'public'],
    default: 'connections',
  })
  communityVisibility: string;

  @Column({ name: 'tracking_consent', default: false })
  trackingConsent: boolean;
}
