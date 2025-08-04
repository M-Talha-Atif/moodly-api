import { Test, TestingModule } from '@nestjs/testing';
import { MoodLogService } from './mood-log.service';

describe('MoodLogService', () => {
  let service: MoodLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoodLogService],
    }).compile();

    service = module.get<MoodLogService>(MoodLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
