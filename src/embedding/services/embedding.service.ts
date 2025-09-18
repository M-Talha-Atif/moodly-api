import { Injectable, Logger } from '@nestjs/common';
import { ApiClientService } from 'src/common/services/api-client.service';

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);

  constructor(private readonly apiClient: ApiClientService) {}

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const { embedding } = await this.apiClient.post<{ embedding: number[] }>(
        '/embed',
        { text },
      );
      return embedding;
    } catch (error) {
      this.logger.error('Failed to generate embedding', error);
      throw error;
    }
  }
}
