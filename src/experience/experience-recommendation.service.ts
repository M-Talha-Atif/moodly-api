import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Experience } from 'src/experience/entities/experience.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';

@Injectable()
export class ExperienceRecommendationService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepo: Repository<Experience>,
    @InjectModel(ExperienceEmbedding.name)
    private readonly experienceEmbeddingModel: Model<ExperienceEmbedding>,
  ) {}

  // === Recommend Experiences Based on User Embedding ===
  async recommend(userEmbedding: number[], limit = 10): Promise<Experience[]> {
    // Use MongoDB's vector search to find similar experiences
    if (!userEmbedding || userEmbedding.length === 0) return [];

    // fetching similar embeddings
    const similarEmbeddings = await this.experienceEmbeddingModel.aggregate([
      {
        $vectorSearch: {
          queryVector: userEmbedding,
          path: 'embedding',
          numCandidates: 100,
          limit,
          index: 'experience_index',
          metric: 'cosine',
        },
      } as any,
    ]);

    const ids = similarEmbeddings.map((e) => e.experienceId);
    if (!ids.length) return [];

    const exps = await this.experienceRepo.find({
      where: { id: In(ids) },
      relations: ['host'],
    });

    const map = new Map(exps.map((e) => [e.id, e]));
    return ids.map((id) => map.get(id)).filter(Boolean) as Experience[];
  }
}
