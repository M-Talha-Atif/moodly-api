import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './services/experience.service';
import { UsersService } from 'src/users/users.service';
import { S3Service } from 'src/common/services/s3.service';

describe('ExperienceController', () => {
  let controller: ExperienceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExperienceController],
      providers: [
        { provide: ExperienceService, useValue: {} },
        { provide: UsersService, useValue: {} },
        { provide: S3Service, useValue: { uploadBuffer: jest.fn() } },
        // JwtCookieGuard is applied per-route on this controller.
        { provide: JwtService, useValue: { verifyAsync: jest.fn() } },
      ],
    }).compile();

    controller = module.get<ExperienceController>(ExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
