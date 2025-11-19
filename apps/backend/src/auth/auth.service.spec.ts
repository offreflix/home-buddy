import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import {
  createMockJwtService,
  createMockRedisService,
  createMockUser,
} from 'src/common/test-helpers/mock-factories';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { User } from '@prisma/client';
import { JwtPayload } from './types/jwt.types';
import { AuthenticatedUser } from './auth.controller';

jest.mock('bcrypt');
jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomUUID: jest.fn(() => 'mock-uuid'),
  createHash: jest.fn(() => ({
    update: jest.fn().mockReturnThis(),
    digest: jest.fn(() => 'hashed-token'),
  })),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let redisService: jest.Mocked<RedisService>;

  const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

  beforeEach(async () => {
    const mockUsersService = {
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      findByGoogleId: jest.fn(),
      updateLastLogin: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UsersService>;

    const mockJwt = createMockJwtService() as unknown as jest.Mocked<JwtService>;
    const mockRedis = createMockRedisService() as unknown as jest.Mocked<RedisService>;

    usersService = mockUsersService;
    jwtService = mockJwt;
    redisService = mockRedis;

    service = new AuthService(usersService, jwtService, redisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('deve retornar usuário quando credenciais são válidas', async () => {
      const username = 'testuser';
      const password = 'password123';
      const mockUser = createMockUser({
        username,
        password: 'hashedPassword',
      });

      usersService.findByUsername.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(username, password);

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(usersService.findByUsername).toHaveBeenCalledWith(username);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(usersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('deve retornar null quando usuário não existe', async () => {
      const username = 'nonexistent';
      const password = 'password123';

      usersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser(username, password);

      expect(result).toBeNull();
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
    });

    it('deve retornar null quando senha está incorreta', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';
      const mockUser = createMockUser({
        username,
        password: 'hashedPassword',
      });

      usersService.findByUsername.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(username, password);

      expect(result).toBeNull();
      expect(mockBcrypt.compare).toHaveBeenCalled();
      expect(usersService.updateLastLogin).not.toHaveBeenCalled();
    });
  });

  describe('signUp', () => {
    it('deve criar usuário e retornar tokens com sucesso', async () => {
      const createDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const mockUser = createMockUser({
        username: createDto.username,
        email: createDto.email,
        password: 'hashedPassword',
      });

      usersService.findByUsername.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashedPassword' as never);
      usersService.createUser.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.signUp(createDto);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(usersService.findByUsername).toHaveBeenCalledWith(
        createDto.username,
      );
      expect(usersService.findByEmail).toHaveBeenCalledWith(createDto.email);
      expect(mockBcrypt.hash).toHaveBeenCalledWith(createDto.password, 12);
      expect(usersService.createUser).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando username já existe', async () => {
      const createDto: CreateUserDto = {
        username: 'existinguser',
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const existingUser = createMockUser({ username: createDto.username });

      usersService.findByUsername.mockResolvedValue(existingUser);

      await expect(service.signUp(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.signUp(createDto)).rejects.toThrow(
        'User already exists',
      );
      expect(usersService.createUser).not.toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      const createDto: CreateUserDto = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'Password123!',
      };

      usersService.findByUsername.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(
        createMockUser({ email: createDto.email }),
      );

      await expect(service.signUp(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(usersService.createUser).not.toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('deve retornar tokens e atualizar lastLogin', async () => {
      const mockUser: AuthenticatedUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: null,
        lastName: null,
        picture: null,
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      const result = await service.signIn(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(usersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('refreshToken', () => {
    it('deve retornar novos tokens quando refresh token é válido', async () => {
      const refreshToken = 'valid-refresh-token';
      const userId = 1;
      const jti = 'mock-jti';

      const mockUser = createMockUser({ id: userId });

      jwtService.verify.mockReturnValue({ sub: userId, jti } as JwtPayload);
      redisService.getToken.mockResolvedValue('hashed-token');
      usersService.findById.mockResolvedValue(mockUser);
      jwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken(refreshToken);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(jwtService.verify).toHaveBeenCalled();
      expect(redisService.getToken).toHaveBeenCalledWith(`refreshToken:${jti}`);
    });

    it('deve lançar UnauthorizedException quando refresh token é inválido', async () => {
      const refreshToken = 'invalid-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid or expired refresh token',
      );
    });

    it('deve lançar UnauthorizedException quando token no Redis não corresponde', async () => {
      const refreshToken = 'valid-refresh-token';
      const userId = 1;
      const jti = 'mock-jti';

      jwtService.verify.mockReturnValue({ sub: userId, jti } as JwtPayload);
      redisService.getToken.mockResolvedValue('different-hash');

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'Invalid refresh token',
      );
    });

    it('deve lançar UnauthorizedException quando usuário não encontrado', async () => {
      const refreshToken = 'valid-refresh-token';
      const userId = 999;
      const jti = 'mock-jti';

      jwtService.verify.mockReturnValue({ sub: userId, jti } as JwtPayload);
      redisService.getToken.mockResolvedValue('hashed-token');
      usersService.findById.mockResolvedValue(null);

      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.refreshToken(refreshToken)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('logout', () => {
    it('deve remover tokens do Redis quando access token é válido', async () => {
      const userId = 1;
      const accessToken = 'valid-access-token';
      const jti = 'mock-jti';

      jwtService.verify.mockReturnValue({ jti } as JwtPayload);

      await service.logout(userId, accessToken);

      expect(redisService.removeToken).toHaveBeenCalledWith(
        `accessToken:${jti}`,
      );
      expect(redisService.removeToken).toHaveBeenCalledWith(
        `refreshToken:${jti}`,
      );
      expect(redisService.removeUserSession).toHaveBeenCalledWith(userId, jti);
    });

    it('deve retornar sem erro quando access token é vazio', async () => {
      const userId = 1;
      const accessToken = '';

      await service.logout(userId, accessToken);

      expect(redisService.removeToken).not.toHaveBeenCalled();
    });

    it('deve tratar erro silenciosamente quando token é inválido', async () => {
      const userId = 1;
      const accessToken = 'invalid-token';

      jwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.logout(userId, accessToken)).resolves.not.toThrow();
    });
  });

  describe('getProfile', () => {
    it('deve retornar perfil do usuário', async () => {
      const userId = 1;
      const mockUser = createMockUser({ id: userId });
      const { password, ...userWithoutPassword } = mockUser;

      usersService.findById.mockResolvedValue(userWithoutPassword as User);

      const result = await service.getProfile(userId);

      expect(result).toBeDefined();
      expect(result).not.toHaveProperty('password');
      expect(usersService.findById).toHaveBeenCalledWith(userId);
    });

    it('deve lançar UnauthorizedException quando usuário não encontrado', async () => {
      const userId = 999;

      usersService.findById.mockResolvedValue(null);

      await expect(service.getProfile(userId)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.getProfile(userId)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('validateOrCreateGoogleUser', () => {
    it('deve retornar usuário existente quando Google ID já existe', async () => {
      const googleUser = {
        email: 'test@example.com',
        username: 'testuser',
        googleId: 'google123',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockUser = createMockUser({
        email: googleUser.email,
        googleId: googleUser.googleId,
      });

      usersService.findByGoogleId.mockResolvedValue(mockUser);

      const result = await service.validateOrCreateGoogleUser(googleUser);

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(usersService.findByGoogleId).toHaveBeenCalledWith(
        googleUser.googleId,
      );
    });

    it('deve criar novo usuário quando não existe', async () => {
      const googleUser = {
        email: 'new@example.com',
        username: 'newuser',
        googleId: 'google123',
        firstName: 'New',
        lastName: 'User',
      };

      const mockUser = createMockUser({
        email: googleUser.email,
        username: googleUser.username,
        googleId: googleUser.googleId,
      });

      usersService.findByGoogleId.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(null);
      usersService.findByUsername.mockResolvedValue(null);
      usersService.createUser.mockResolvedValue(mockUser);

      const result = await service.validateOrCreateGoogleUser(googleUser);

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(usersService.createUser).toHaveBeenCalled();
    });

    it('deve retornar erro quando email existe com senha', async () => {
      const googleUser = {
        email: 'existing@example.com',
        username: 'existinguser',
        googleId: 'google123',
      };

      const existingUser = createMockUser({
        email: googleUser.email,
        password: 'hashedPassword',
      });

      usersService.findByGoogleId.mockResolvedValue(null);
      usersService.findByEmail.mockResolvedValue(existingUser);

      const result = await service.validateOrCreateGoogleUser(googleUser);

      expect(result).toEqual({ error: 'user_conflict' });
    });
  });

  describe('linkGoogleAccount', () => {
    it('deve vincular conta Google com sucesso', async () => {
      const userId = 1;
      const googleUser = {
        googleId: 'google123',
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/picture.jpg',
      };

      const mockUser = createMockUser({
        id: userId,
        googleId: googleUser.googleId,
      });

      usersService.updateUser.mockResolvedValue(mockUser);

      const result = await service.linkGoogleAccount(userId, googleUser);

      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      });
      expect(usersService.updateUser).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          googleId: googleUser.googleId,
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          picture: googleUser.picture,
        },
      });
    });
  });
});
