import { Test, TestingModule } from '@nestjs/testing';
import { EmbeddingService } from './services/embedding.service';
import { ApiClientService } from 'src/common/services/api-client.service';

describe('EmbeddingService', () => {
  let service: EmbeddingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingService,
        { provide: ApiClientService, useValue: { post: jest.fn() } },
      ],
    }).compile();

    service = module.get<EmbeddingService>(EmbeddingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
