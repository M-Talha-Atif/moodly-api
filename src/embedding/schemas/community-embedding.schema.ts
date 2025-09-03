// src/embedding/schemas/community-embedding.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CommunityEmbedding extends Document {
  @Prop({ required: true })
  communityId: string; // Link to Postgres Community

  @Prop({ type: [Number], required: true })
  embedding: number[]; // Vector representation (weighted: name, description, category, tags, rules, location)
}

export const CommunityEmbeddingSchema =
  SchemaFactory.createForClass(CommunityEmbedding);
