ok so im using domain feature based frontend,
hosts will create experiences and also they can create communities , also they can signup and login

currently my web supports users i mean user who can book experiences and join different communitiies and do posting there

my entity has
import {
Entity,
PrimaryGeneratedColumn,
Column,
ManyToOne,
OneToMany,
CreateDateColumn,
UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Booking } from '../../booking/entities/booking.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';

@Entity()
export class Experience {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
title: string;

@Column('text')
description: string;

@Column({ type: 'timestamp' })
date: Date;

@Column()
location: string;

@Column()
image: string;

@Column()
isVirtual: boolean;

@Column({ type: 'timestamp' })
sessionStartTime: Date;

@Column({ type: 'timestamp' })
sessionEndTime: Date;

@Column()
price: number;

@Column()
timezone: string;

@Column()
totalSpots: number;

@Column({ default: 0 })
spotsFilled: number;

@Column({ nullable: true })
meetingLink: string;

@Column({ nullable: true })
cancellationPolicy: string;

@Column('jsonb', { nullable: true })
aiPrep: any;

@Column('jsonb', { nullable: true })
testimonials: any;

@Column('jsonb', { nullable: true })
preparation: any;

// 🔥 Emotional Matching Fields
@Column('simple-array', { nullable: true })
targetEmotions: string[];

@Column('simple-array', { nullable: true })
desiredOutcomes: string[];

// 🌍 Cultural Context
@Column({ nullable: true })
language: string;

@Column('text', { array: true, nullable: true })
culturalTags: string[];

// 📈 Growth & Outcomes
@Column('jsonb', { nullable: true })
growthDimensions: any;

@Column({ type: 'text', nullable: true })
experienceOutcomeSummary: string;

// 👥 Community / Matchmaking
@Column('simple-array', { nullable: true })
idealParticipantTraits: string[];

// 📊 AI Engagement Stats
@Column('jsonb', { nullable: true })
engagementStats: any;

// 👤 Host (Relation)
@ManyToOne(() => User, (user) => user.experiences, { eager: false })
host: User;

@OneToMany(() => Booking, (booking) => booking.experience)
bookings: Booking[];

@OneToMany(() => Feedback, (feedback) => feedback.experience)
feedbacks: Feedback[];

@CreateDateColumn()
createdAt: Date;

@UpdateDateColumn()
updatedAt: Date;
}

create one
import {
IsString,
IsDateString,
IsBoolean,
IsNumber,
IsArray,
IsOptional,
IsObject,
} from 'class-validator';

export class CreateExperienceDto {
@IsString()
title: string;

@IsString()
description: string;

@IsDateString()
date: string;

@IsString()
location: string;

@IsString()
image: string;

@IsBoolean()
isVirtual: boolean;

@IsDateString()
sessionStartTime: string;

@IsDateString()
sessionEndTime: string;

@IsNumber()
price: number;

@IsString()
timezone: string;

@IsNumber()
totalSpots: number;

@IsOptional()
@IsNumber()
spotsFilled?: number;

@IsOptional()
@IsString()
meetingLink?: string;

@IsOptional()
@IsString()
cancellationPolicy?: string;

@IsOptional()
@IsObject()
aiPrep?: any;

@IsOptional()
@IsObject()
testimonials?: any;

@IsOptional()
@IsObject()
preparation?: any;

@IsOptional()
@IsArray()
targetEmotions?: string[];

@IsOptional()
@IsArray()
desiredOutcomes?: string[];

@IsOptional()
@IsString()
language?: string;

@IsOptional()
@IsArray()
@IsString({ each: true })
culturalTags?: string[];

@IsOptional()
@IsObject()
growthDimensions?: any;

@IsOptional()
@IsString()
experienceOutcomeSummary?: string;

@IsOptional()
@IsArray()
idealParticipantTraits?: string[];

@IsOptional()
@IsObject()
engagementStats?: any;
}

---

import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceDto } from './create-experience.dto';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}

so first want to store
