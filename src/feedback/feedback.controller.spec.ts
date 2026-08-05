import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { PendingFeedbackService } from './pending-feedback.service';

describe('FeedbackController', () => {
  let controller: FeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        {
          provide: FeedbackService,
          useValue: { create: jest.fn(), findAllForExperience: jest.fn() },
        },
        {
          provide: PendingFeedbackService,
          useValue: { findForUser: jest.fn(), deleteById: jest.fn() },
        },
        // JwtCookieGuard is applied per-route on this controller.
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
