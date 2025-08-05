// src/embedding/schemas/experience-embedding.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ExperienceEmbedding extends Document {
  @Prop({ required: true })
  experienceId: string; // Link to Postgres Experience

  @Prop({ type: [Number], required: true })
  embedding: number[];
}

export const ExperienceEmbeddingSchema =
  SchemaFactory.createForClass(ExperienceEmbedding);
