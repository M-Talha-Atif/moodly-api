import { Test, TestingModule } from '@nestjs/testing';
import { EmotionController } from './emotion.controller';

describe('EmotionController', () => {
  let controller: EmotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmotionController],
    }).compile();

    controller = module.get<EmotionController>(EmotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
