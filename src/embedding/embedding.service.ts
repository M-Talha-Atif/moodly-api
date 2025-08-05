// embedding/embedding.service.ts
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private readonly EMBEDDING_API = 'http://localhost:8000/embed';

  async generateEmbedding(text: string): Promise<number[]> {
    const res = await fetch(this.EMBEDDING_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      throw new HttpException('Failed to generate embedding', res.status);
    }

    const { embedding } = await res.json();
    return embedding;
  }
}
