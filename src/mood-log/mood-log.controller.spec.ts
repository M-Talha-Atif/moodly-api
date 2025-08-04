import { Test, TestingModule } from '@nestjs/testing';
import { MoodLogController } from './mood-log.controller';

describe('MoodLogController', () => {
  let controller: MoodLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoodLogController],
    }).compile();

    controller = module.get<MoodLogController>(MoodLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
