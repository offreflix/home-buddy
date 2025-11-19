import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  createMockPrismaService,
  createMockPaginationService,
  createMockUser,
  createMockUserEntity,
  createMockRequest,
  createMockCategory,
} from 'src/common/test-helpers/mock-factories';
import { Category } from '@prisma/client';
import { PaginationResult } from 'src/common/dto/pagination.dto';
import { Request } from 'express';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prismaService: jest.Mocked<PrismaService>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockPagination = createMockPaginationService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prismaService = module.get(PrismaService);
    paginationService = module.get(PaginationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar uma categoria com sucesso', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Bebidas',
      };

      const mockCategory = createMockCategory({
        id: 1,
        name: createDto.name,
      });

      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.category.create as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
      expect(prismaService.category.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('deve lançar UnprocessableEntityException quando categoria já existe', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Bebidas',
      };

      (prismaService.category.findFirst as jest.Mock).mockResolvedValue(
        createMockCategory({ id: 1, name: createDto.name }),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(createDto)).rejects.toThrow('Categoria já existe');
      expect(prismaService.category.create).not.toHaveBeenCalled();
    });
  });

  describe('createMany', () => {
    it('deve criar múltiplas categorias com sucesso', async () => {
      const createDtos: CreateCategoryDto[] = [
        { name: 'Bebidas' },
        { name: 'Alimentos' },
      ];

      const mockResult: { count: number } = {
        count: 2,
      };

      (prismaService.category.findMany as jest.Mock).mockResolvedValue([]);
      (prismaService.category.createMany as jest.Mock).mockResolvedValue(mockResult);

      const result = await service.createMany(createDtos);

      expect(result).toEqual(mockResult);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: {
          name: { in: ['Bebidas', 'Alimentos'] },
        },
        select: { name: true },
      });
      expect(prismaService.category.createMany).toHaveBeenCalledWith({
        data: createDtos,
      });
    });

    it('deve lançar UnprocessableEntityException quando algumas categorias já existem', async () => {
      const createDtos: CreateCategoryDto[] = [
        { name: 'Bebidas' },
        { name: 'Alimentos' },
      ];

      (prismaService.category.findMany as jest.Mock).mockResolvedValue([
        createMockCategory({ name: 'Bebidas' }),
      ]);

      await expect(service.createMany(createDtos)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.createMany(createDtos)).rejects.toThrow(
        'As seguintes categorias já existem: Bebidas',
      );
      expect(prismaService.category.createMany).not.toHaveBeenCalled();
    });

    it('deve lançar UnprocessableEntityException quando todas as categorias já existem', async () => {
      const createDtos: CreateCategoryDto[] = [
        { name: 'Bebidas' },
        { name: 'Alimentos' },
      ];

      (prismaService.category.findMany as jest.Mock).mockResolvedValue([
        createMockCategory({ name: 'Bebidas' }),
        createMockCategory({ name: 'Alimentos' }),
      ]);

      await expect(service.createMany(createDtos)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.createMany(createDtos)).rejects.toThrow(
        'As seguintes categorias já existem: Bebidas, Alimentos',
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar categorias paginadas com sucesso', async () => {
      const mockRequest = createMockRequest();
      const mockCategories: Category[] = [
        createMockCategory({ id: 1, name: 'Bebidas' }),
      ];

      const mockTotal = 1;
      const mockPaginationResult: PaginationResult<Category> = {
        data: mockCategories,
        meta: {
          page: 1,
          perPage: 10,
          total: mockTotal,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          from: 1,
          to: 1,
        },
        links: {
          self: 'http://localhost/categories?page=1&perPage=10',
          next: null as string | null,
          prev: null as string | null,
          first: 'http://localhost/categories?page=1&perPage=10',
          last: 'http://localhost/categories?page=1&perPage=10',
        },
      };

      (prismaService.category.count as jest.Mock).mockResolvedValue(mockTotal);
      (prismaService.category.findMany as jest.Mock).mockResolvedValue(mockCategories);
      paginationService.createPaginationOptions.mockReturnValue({
        page: 1,
        perPage: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      paginationService.getPrismaPaginationOptions.mockReturnValue({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      paginationService.createPaginatedResponse.mockReturnValue(mockPaginationResult);

      const result = await service.findAll({}, mockRequest as Request);

      expect(result).toEqual(mockPaginationResult);
      expect(prismaService.category.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar uma categoria quando encontrada', async () => {
      const categoryId = 1;
      const mockCategory = createMockCategory({
        id: categoryId,
        name: 'Bebidas',
      });

      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(mockCategory);

      const result = await service.findOne(categoryId, mockUser);

      expect(result).toEqual(mockCategory);
      expect(prismaService.category.findUnique).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('deve lançar NotFoundException quando categoria não encontrada', async () => {
      const categoryId = 999;
      (prismaService.category.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(categoryId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve retornar mensagem de atualização', () => {
      const categoryId = 1;
      const result = service.update(categoryId, { name: 'Updated Category' });

      expect(result).toBe(`This action updates a #${categoryId} category`);
    });
  });

  describe('remove', () => {
    it('deve retornar mensagem de remoção', () => {
      const categoryId = 1;
      const result = service.remove(categoryId);

      expect(result).toBe(`This action removes a #${categoryId} category`);
    });
  });
});
