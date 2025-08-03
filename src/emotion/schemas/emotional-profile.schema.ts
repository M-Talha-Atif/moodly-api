import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class EmotionalProfile extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop()
  emotion: string;

  @Prop([String])
  goals: string[];

  @Prop([String])
  activities: string[];

  @Prop()
  social: string;

  @Prop()
  community: string;
}

export const EmotionalProfileSchema =
  SchemaFactory.createForClass(EmotionalProfile);
