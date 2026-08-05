import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PrivacySettings } from './entities/privacy.entity';
import { NotFoundException } from '@nestjs/common';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

const mockPrivacyRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: ReturnType<typeof mockUserRepository>;
  let privacyRepo: ReturnType<typeof mockPrivacyRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        {
          provide: getRepositoryToken(PrivacySettings),
          useFactory: mockPrivacyRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    privacyRepo = module.get(getRepositoryToken(PrivacySettings));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('creates a user without privacy settings', async () => {
      const dto = { email: 'test@talha.com', passwordHash: 'hashed' };
      const user = { id: '1', ...dto };

      userRepo.create.mockReturnValue(user as any);
      userRepo.save.mockResolvedValue(user as any);

      const result = await service.create(dto as any);

      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
      expect(userRepo.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('creates a user with privacy settings', async () => {
      const dto = {
        email: 'test@talha.com',
        passwordHash: 'hashed',
        privacySettings: {
          dataSharingLevel: 'balanced',
          communityVisibility: 'connections',
        },
      };

      const user = { id: '1', ...dto };
      const savedUser = { ...user };
      const savedPrivacy = {
        id: 'ps1',
        ...dto.privacySettings,
        trackingConsent: false,
        user: savedUser,
      };

      userRepo.create.mockReturnValue(user as any);
      userRepo.save.mockResolvedValue(savedUser as any);
      privacyRepo.create.mockReturnValue(savedPrivacy as any);
      privacyRepo.save.mockResolvedValue(savedPrivacy as any);

      const result = await service.create(dto as any);

      expect(privacyRepo.create).toHaveBeenCalled();
      expect(privacyRepo.save).toHaveBeenCalled();
      expect(result.privacySettings).toEqual(savedPrivacy);
    });
  });

  describe('findOne', () => {
    it('returns a user if found', async () => {
      const user = { id: '1', email: 'test@talha.com' };
      userRepo.findOne.mockResolvedValue(user as any);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
    });

    it('throws NotFoundException if not found', async () => {
      userRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates and returns the user', async () => {
      const user = { id: '1', email: 'old@example.com' };
      const updateDto = { email: 'new@example.com' };

      userRepo.findOne.mockResolvedValue(user as any);
      userRepo.save.mockResolvedValue({ ...user, ...updateDto } as any);

      const result = await service.update('1', updateDto as any);
      expect(result.email).toEqual('new@example.com');
    });
  });

  describe('remove', () => {
    it('deletes a user', async () => {
      userRepo.delete.mockResolvedValue({ affected: 1 } as any);
      await service.remove('1');
      expect(userRepo.delete).toHaveBeenCalledWith('1');
    });
  });
});
