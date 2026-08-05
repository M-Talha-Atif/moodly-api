import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    // Triggers RedisService.onModuleDestroy() so the ioredis socket and its retry
    // timers don't keep the Jest process alive after the suite finishes.
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
