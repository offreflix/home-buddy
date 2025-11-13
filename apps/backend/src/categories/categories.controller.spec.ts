import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  createMockUser,
  createMockUserEntity,
  createMockRequest,
  createMockCategory,
} from 'src/common/test-helpers/mock-factories';
import { Category } from '@prisma/client';
import { PaginationResult } from 'src/common/dto/pagination.dto';
import { Request } from 'express';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockUser = createMockUserEntity({ id: 1 });
  const mockRequest = createMockRequest();

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      createMany: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValue(mockCategory);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('deve propagar erro quando service lança exceção', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Bebidas',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new UnprocessableEntityException('Categoria já existe'));

      await expect(controller.create(createDto)).rejects.toThrow(
        UnprocessableEntityException,
      );
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

      jest.spyOn(service, 'createMany').mockResolvedValue(mockResult);

      const result = await controller.createMany(createDtos);

      expect(result).toEqual(mockResult);
      expect(service.createMany).toHaveBeenCalledWith(createDtos);
    });

    it('deve propagar erro quando algumas categorias já existem', async () => {
      const createDtos: CreateCategoryDto[] = [
        { name: 'Bebidas' },
        { name: 'Alimentos' },
      ];

      jest
        .spyOn(service, 'createMany')
        .mockRejectedValue(
          new UnprocessableEntityException('As seguintes categorias já existem: Bebidas'),
        );

      await expect(controller.createMany(createDtos)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar categorias paginadas', async () => {
      const query = { page: 1, perPage: 10 };
      const mockResult: PaginationResult<Category> = {
        data: [],
        meta: { page: 1, perPage: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false, from: 0, to: 0 },
        links: { self: '', next: null, prev: null, first: '', last: '' },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll(query, mockRequest as Request);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(query, mockRequest);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma categoria quando encontrada', async () => {
      const categoryId = '1';
      const mockCategory = createMockCategory({
        id: 1,
        name: 'Bebidas',
      });

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCategory);

      const result = await controller.findOne(categoryId, mockUser);

      expect(result).toEqual(mockCategory);
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
    });

    it('deve propagar NotFoundException quando categoria não encontrada', async () => {
      const categoryId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(categoryId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve retornar mensagem de atualização', async () => {
      const categoryId = '1';
      const updateDto = { name: 'Bebidas Atualizado' };
      const mockResult = 'This action updates a #1 category';

      jest.spyOn(service, 'update').mockReturnValue(mockResult);

      const result = await controller.update(categoryId, updateDto);

      expect(result).toBe(mockResult);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('deve retornar mensagem de remoção', async () => {
      const categoryId = '1';
      const mockResult = 'This action removes a #1 category';

      jest.spyOn(service, 'remove').mockReturnValue(mockResult);

      const result = await controller.remove(categoryId);

      expect(result).toBe(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
