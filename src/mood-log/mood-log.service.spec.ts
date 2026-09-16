import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoodLogService } from './services/mood-log.service';
import { MoodLog } from './entities/mood-log.entity';
import { ValidationService } from './services/validation.service';
import { StorageService } from './services/storage.service';
import { EmotionAnalysisService } from './services/emotion-analysis.service';
import { ExperienceRecommendationService } from 'src/experience/experience-recommendation.service';

describe('MoodLogService', () => {
  let service: MoodLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoodLogService,
        {
          provide: getRepositoryToken(MoodLog),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
        {
          provide: ValidationService,
          useValue: { validateInputs: jest.fn(), validateVoiceFile: jest.fn() },
        },
        { provide: StorageService, useValue: { save: jest.fn() } },
        {
          provide: EmotionAnalysisService,
          useValue: {
            analyzeImageEmotion: jest.fn(),
            analyzeVoiceEmotion: jest.fn(),
          },
        },
        {
          provide: ExperienceRecommendationService,
          useValue: { recommendByEmotion: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<MoodLogService>(MoodLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
