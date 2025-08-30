import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

// ---- Mock factories ----
const mockUsersService = () => ({
  findByEmail: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: ReturnType<typeof mockUsersService>;
  let jwtService: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useFactory: mockUsersService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);

    jest.clearAllMocks(); // reset mocks before each test
  });

  // ---- SIGNUP TESTS ----
  describe('signUp', () => {
    it('should fail if email already exists', async () => {
      const dto: SignUpDto = {
        email: 'test@talha.com',
        password: 'password123',
      };
      usersService.findByEmail.mockResolvedValue({
        id: '1',
        email: dto.email,
      } as any);

      const result = await service.signUp(dto);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Email already exists');
      expect(result.statusCode).toBe(409);
    });

    it('should hash password and create user if email is new', async () => {
      const dto: SignUpDto = {
        email: 'new@talha.com',
        password: 'password123',
      };

      usersService.findByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      usersService.create.mockResolvedValue({
        id: '1',
        email: dto.email,
      } as any);

      const result = await service.signUp(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 12);
      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: dto.email,
          passwordHash: 'hashedPassword',
          role: UserRole.USER,
        }),
      );
      expect(result.success).toBe(true);
      expect(result.data.email).toBe(dto.email);
    });
  });

  // ---- LOGIN TESTS ----
  describe('login', () => {
    it('should fail if user not found', async () => {
      const dto: LoginDto = {
        email: 'notfound@talha.com',
        password: 'wrongpass',
      };
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.login(dto);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Invalid credentials');
      expect(result.statusCode).toBe(401);
    });

    it('should fail if password does not match', async () => {
      const dto: LoginDto = { email: 'test@talha.com', password: 'wrongpass' };
      const user = { id: '1', email: dto.email, passwordHash: 'hashed' };

      usersService.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.login(dto);

      expect(result.success).toBe(false);
      expect(result.reason).toBe('Invalid credentials');
      expect(result.statusCode).toBe(401);
    });

    it('should return JWT token if credentials are valid', async () => {
      const dto: LoginDto = {
        email: 'test@talha.com',
        password: 'correctpass',
      };
      const user = {
        id: '1',
        email: dto.email,
        passwordHash: 'hashed',
        role: UserRole.USER,
      };

      usersService.findByEmail.mockResolvedValue(user as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('signed-jwt-token');

      const result = await service.login(dto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: user.id,
        email: user.email,
        role: user.role,
      });
      expect(result.success).toBe(true);
      expect(result.data.access_token).toBe('signed-jwt-token');
    });
  });

  // ---- LOGOUT TESTS ----
  describe('logout', () => {
    it('should return success', async () => {
      const result = await service.logout();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logout successful');
      expect(result.statusCode).toBe(200);
    });
  });
});
