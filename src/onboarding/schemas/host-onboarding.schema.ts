// src/onboarding/schemas/user-onboarding.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class HostOnboarding extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  // Dynamic Q&A (chat-style, quiz, progressive)
  @Prop([
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ])
  responses: { question: string; answer: string }[];

  // Goals user set during onboarding
  @Prop([String])
  goals: string[];

  // User preferred activities
  @Prop([String])
  activities: string[];

  // Progress tracker (step index, completed flag)
  @Prop({ default: 0 })
  currentStep: number;

  @Prop({ default: false })
  completed: boolean;
}

export const HostOnboardingSchema =
  SchemaFactory.createForClass(HostOnboarding);
