import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import { ExperienceService } from '../experience/services/experience.service';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getRepositoryToken(Feedback),
          useValue: { find: jest.fn(), exist: jest.fn(), findOne: jest.fn() },
        },
        { provide: ExperienceService, useValue: { findOne: jest.fn() } },
        {
          provide: DataSource,
          useValue: { getRepository: jest.fn(), createQueryRunner: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
