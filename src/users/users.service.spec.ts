import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PrivacySettings } from './entities/privacy.entity';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

// ---- Mock Repositories ----
// These are fake versions of TypeORM repositories so we don’t hit a real DB.
const mockUserRepository = () => ({
  create: jest.fn(), // fake "create" method
  save: jest.fn(), // fake "save" method
  find: jest.fn(), // fake "find" method
  findOne: jest.fn(), // fake "findOne" method
  delete: jest.fn(), // fake "delete" method
});

const mockPrivacyRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
});

// ---- Test Suite ----
describe('UsersService', () => {
  let service: UsersService; // service under test
  let userRepo: jest.Mocked<Repository<User>>; // mocked User repo
  let privacyRepo: jest.Mocked<Repository<PrivacySettings>>; // mocked Privacy repo

  // Runs before EACH test → builds a fresh TestingModule
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, // service we are testing
        // Inject fake repositories instead of real database
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        {
          provide: getRepositoryToken(PrivacySettings),
          useFactory: mockPrivacyRepository,
        },
      ],
    }).compile();

    // Get the service and mocked repos
    service = module.get<UsersService>(UsersService);
    userRepo = module.get(getRepositoryToken(User));
    privacyRepo = module.get(getRepositoryToken(PrivacySettings));
  });

  // ---- CREATE Tests ----
  describe('create', () => {
    it('should create a user without privacy settings', async () => {
      // DTO (input)
      const dto = {
        email: 'test@talha.com',
        passwordHash: 'hashed',
      };

      const user = { id: '1', ...dto };

      // Mock repo responses
      userRepo.create.mockReturnValue(user as any);
      userRepo.save.mockResolvedValue(user as any);

      // Call service method
      const result = await service.create(dto as any);

      // Verify that repo methods were called correctly
      expect(userRepo.create).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
      expect(userRepo.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });

    it('should create a user with privacy settings', async () => {
      const dto = {
        email: 'test@talha.com',
        passwordHash: 'hashed',
        privacySettings: {
          dataSharingLevel: 'balanced',
          communityVisibility: 'connections',
        },
      };

      // Fake DB objects
      const user = { id: '1', ...dto };
      const savedUser = { ...user };
      const savedPrivacy = {
        id: 'ps1',
        ...dto.privacySettings,
        trackingConsent: false,
        user: savedUser,
      };

      // Mock repo calls
      userRepo.create.mockReturnValue(user as any);
      userRepo.save.mockResolvedValue(savedUser as any);
      privacyRepo.create.mockReturnValue(savedPrivacy as any);
      privacyRepo.save.mockResolvedValue(savedPrivacy as any);

      const result = await service.create(dto as any);

      // Verify both user + privacy settings saved
      expect(privacyRepo.create).toHaveBeenCalled();
      expect(privacyRepo.save).toHaveBeenCalled();
      expect(result.privacySettings).toEqual(savedPrivacy);
    });
  });

  // ---- FIND Tests ----
  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: '1', email: 'test@talha.com' };
      userRepo.findOne.mockResolvedValue(user as any);

      const result = await service.findOne('1');
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  // ---- UPDATE Tests ----
  describe('update', () => {
    it('should update and return the user', async () => {
      const user = { id: '1', email: 'old@example.com' };
      const updateDto = { email: 'new@example.com' };

      userRepo.findOne.mockResolvedValue(user as any);
      userRepo.save.mockResolvedValue({ ...user, ...updateDto } as any);

      const result = await service.update('1', updateDto as any);

      expect(result.email).toEqual('new@example.com');
    });
  });

  // ---- REMOVE Tests ----
  describe('remove', () => {
    it('should delete a user', async () => {
      userRepo.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove('1');

      expect(userRepo.delete).toHaveBeenCalledWith('1');
    });
  });
});
