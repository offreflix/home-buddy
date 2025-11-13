import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LinkGoogleDto } from './dto/link-google.dto';
import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createMockUser,
  createMockResponse,
} from 'src/common/test-helpers/mock-factories';
import { Request } from 'express';
import { AuthenticatedUser, AuthRequest } from './auth.controller';
import { RequestWithCookies } from './types/express.types';
import { Response } from 'express';
import { User } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = createMockUser({ id: 1 });

  beforeEach(async () => {
    const mockService = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      getProfile: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      googleAuthCallback: jest.fn(),
      linkGoogleAccount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('deve retornar tokens quando login é bem-sucedido', async () => {
      const mockTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      jest.spyOn(service, 'signIn').mockResolvedValue(mockTokens);

      const result = await controller.signIn(mockRequest);

      expect(result).toEqual(mockTokens);
      expect(service.signIn).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('signUp', () => {
    it('deve criar usuário e retornar tokens', async () => {
      const createDto: CreateUserDto = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'Password123!',
      };

      const mockTokens = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
      };

      jest.spyOn(service, 'signUp').mockResolvedValue(mockTokens);

      const result = await controller.signUp(createDto);

      expect(result).toEqual(mockTokens);
      expect(service.signUp).toHaveBeenCalledWith(createDto);
    });

    it('deve propagar ConflictException quando usuário já existe', async () => {
      const createDto: CreateUserDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'Password123!',
      };

      jest
        .spyOn(service, 'signUp')
        .mockRejectedValue(new ConflictException('User already exists'));

      await expect(controller.signUp(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getProfile', () => {
    it('deve retornar perfil do usuário autenticado', async () => {
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const mockProfile: User = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: null,
        lastName: null,
        picture: null,
        googleId: null,
        lastLoginAt: new Date(),
      };

      jest.spyOn(service, 'getProfile').mockResolvedValue(mockProfile);

      const result = await controller.getProfile(mockRequest);

      expect(result).toEqual(mockProfile);
      expect(service.getProfile).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('logout', () => {
    it('deve fazer logout com sucesso usando token do header', async () => {
      const mockRequest: AuthRequest & RequestWithCookies = {
        user: mockUser,
        headers: {
          authorization: 'Bearer access-token',
        },
        cookies: {},
      } as AuthRequest & RequestWithCookies;

      jest.spyOn(service, 'logout').mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(service.logout).toHaveBeenCalledWith(mockUser.id, 'access-token');
    });

    it('deve fazer logout usando cookie quando header não está presente', async () => {
      const mockRequest: AuthRequest & RequestWithCookies = {
        user: mockUser,
        headers: {},
        cookies: {
          access_token: 'cookie-access-token',
        },
      } as AuthRequest & RequestWithCookies;

      jest.spyOn(service, 'logout').mockResolvedValue(undefined);

      const result = await controller.logout(mockRequest);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(service.logout).toHaveBeenCalledWith(mockUser.id, 'cookie-access-token');
    });
  });

  describe('refresh', () => {
    it('deve retornar novos tokens quando refresh token é válido', async () => {
      const refreshDto: RefreshTokenDto = {
        refresh_token: 'valid-refresh-token',
      };

      const mockTokens = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };

      jest.spyOn(service, 'refreshToken').mockResolvedValue(mockTokens);

      const result = await controller.refresh(refreshDto);

      expect(result).toEqual(mockTokens);
      expect(service.refreshToken).toHaveBeenCalledWith(refreshDto.refresh_token);
    });

    it('deve propagar UnauthorizedException quando refresh token é inválido', async () => {
      const refreshDto: RefreshTokenDto = {
        refresh_token: 'invalid-token',
      };

      jest
        .spyOn(service, 'refreshToken')
        .mockRejectedValue(new UnauthorizedException('Invalid or expired refresh token'));

      await expect(controller.refresh(refreshDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('googleAuth', () => {
    it('deve ser um endpoint vazio (redirecionamento é feito pelo guard)', async () => {
      const result = await controller.googleAuth();

      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthCallback', () => {
    it('deve chamar service.googleAuthCallback', async () => {
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const mockResponse = createMockResponse();

      jest.spyOn(service, 'googleAuthCallback').mockResolvedValue(undefined);

      await controller.googleAuthCallback(mockRequest, mockResponse);

      expect(service.googleAuthCallback).toHaveBeenCalledWith(mockRequest, mockResponse);
    });
  });

  describe('linkGoogleAccount', () => {
    it('deve vincular conta Google com sucesso', async () => {
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const linkDto: LinkGoogleDto = {
        googleId: 'google123',
        firstName: 'Test',
        lastName: 'User',
        picture: 'https://example.com/picture.jpg',
      };

      const mockResult = {
        id: mockUser.id,
        username: mockUser.username,
        email: mockUser.email,
      };

      jest.spyOn(service, 'linkGoogleAccount').mockResolvedValue(mockResult);

      const result = await controller.linkGoogleAccount(mockRequest, linkDto);

      expect(result).toEqual(mockResult);
      expect(service.linkGoogleAccount).toHaveBeenCalledWith(mockUser.id, linkDto);
    });
  });

  describe('verifyCookies', () => {
    it('deve retornar mensagem de autenticação', async () => {
      const result = await controller.verifyCookies();

      expect(result).toEqual({ message: 'Autenticado com cookie!' });
    });
  });
});
