import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { createMockPrismaService, createMockUser } from 'src/common/test-helpers/mock-factories';
import { User } from '@prisma/client';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUsername', () => {
    it('deve retornar usuário quando encontrado', async () => {
      const username = 'testuser';
      const mockUser = createMockUser({ username });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByUsername(username);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username },
      });
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      const username = 'nonexistent';

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByUsername(username);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário quando encontrado', async () => {
      const email = 'test@example.com';
      const mockUser = createMockUser({ email });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      const email = 'nonexistent@example.com';

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('deve retornar usuário sem password quando encontrado', async () => {
      const userId = 1;
      const mockUser = createMockUser({ id: userId });
      const { password, ...userWithoutPassword } = mockUser;

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(userWithoutPassword as User);

      const result = await service.findById(userId);

      expect(result).not.toHaveProperty('password');
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        omit: { password: true },
      });
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      const userId = 999;

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('deve criar usuário com sucesso', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'hashedPassword',
      };

      const mockUser = createMockUser(userData);

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser(userData);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: userData,
      });
    });
  });

  describe('updateUser', () => {
    it('deve atualizar usuário com sucesso', async () => {
      const userId = 1;
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };

      const mockUpdatedUser = createMockUser({
        id: userId,
        ...updateData,
      });

      (prismaService.user.update as jest.Mock).mockResolvedValue(mockUpdatedUser);

      const result = await service.updateUser({
        where: { id: userId },
        data: updateData,
      });

      expect(result).toEqual(mockUpdatedUser);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });
  });

  describe('findByGoogleId', () => {
    it('deve retornar usuário quando encontrado', async () => {
      const googleId = 'google123';
      const mockUser = createMockUser({ googleId });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findByGoogleId(googleId);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { googleId },
      });
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      const googleId = 'nonexistent';

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.findByGoogleId(googleId);

      expect(result).toBeNull();
    });
  });

  describe('updateLastLogin', () => {
    it('deve atualizar lastLoginAt do usuário', async () => {
      const userId = 1;

      (prismaService.user.update as jest.Mock).mockResolvedValue({} as User);

      await service.updateLastLogin(userId);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { lastLoginAt: expect.any(Date) },
      });
    });
  });
});
