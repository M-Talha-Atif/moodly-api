import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MoodLogService } from './services/mood-log.service';
import { MoodLog } from './entities/mood-log.entity';
import { ValidationService } from './services/validation.service';
import { StorageService } from './services/storage.service';
import { RMQ_DOMAINS } from 'src/infra/config/rmq.constants';

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
        { provide: RMQ_DOMAINS.MOOD.CLIENT, useValue: { emit: jest.fn() } },
        {
          provide: ValidationService,
          useValue: { validateInputs: jest.fn(), validateVoiceFile: jest.fn() },
        },
        { provide: StorageService, useValue: { save: jest.fn() } },
      ],
    }).compile();

    service = module.get<MoodLogService>(MoodLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
