// src/embedding/schemas/moodlog-embedding.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MoodLogEmbedding extends Document {
  @Prop({ required: true })
  moodLogId: string;

  @Prop({ required: true })
  userId: string;   // <-- Add this

  @Prop({ type: [Number], required: true })
  embedding: number[];
}

export const MoodLogEmbeddingSchema =
  SchemaFactory.createForClass(MoodLogEmbedding);
