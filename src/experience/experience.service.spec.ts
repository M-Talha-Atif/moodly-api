import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getModelToken } from '@nestjs/mongoose';
import { ExperienceService } from './services/experience.service';
import { Experience } from './entities/experience.entity';
import { EmbeddingService } from 'src/embedding/services/embedding.service';
import { ExperienceEmbedding } from 'src/embedding/schemas/experience-embedding.schema';
import { ExperienceFilterService } from './services/experience-filter.service';
import { S3Service } from 'src/common/services/s3.service';

describe('ExperienceService', () => {
  let service: ExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExperienceService,
        {
          provide: getRepositoryToken(Experience),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: EmbeddingService,
          useValue: { generateEmbedding: jest.fn() },
        },
        {
          provide: getModelToken(ExperienceEmbedding.name),
          useValue: { create: jest.fn(), findOne: jest.fn() },
        },
        { provide: ExperienceFilterService, useValue: {} },
        { provide: S3Service, useValue: { uploadBuffer: jest.fn() } },
      ],
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
