import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { MoodLogController } from './mood-log.controller';
import { MoodLogService } from './services/mood-log.service';

describe('MoodLogController', () => {
  let controller: MoodLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodLogController],
      providers: [
        {
          provide: MoodLogService,
          useValue: {
            createForUser: jest.fn(),
            getTodayRecentMoodLog: jest.fn(),
            getRecentMoodLog: jest.fn(),
            getHistoryForUser: jest.fn(),
            getDailySummary: jest.fn(),
            getLogsInRange: jest.fn(),
            getMoodLogStreak: jest.fn(),
            getHeatmapData: jest.fn(),
          },
        },
        // JwtCookieGuard is applied per-route on this controller and needs a real
        // JwtService dependency resolved even though we never exercise auth here.
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<MoodLogController>(MoodLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
