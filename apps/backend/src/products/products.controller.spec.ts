import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { MostConsumedDto } from './dto/most-consumed.dto';
import { GetStockMovementsDto } from './dto/get-stock-movements.dto';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Unit, Product } from '@prisma/client';
import {
  createMockUser,
  createMockUserEntity,
  createMockRequest,
  createMockProduct,
} from 'src/common/test-helpers/mock-factories';
import { ProductWithRelations } from 'src/common/types/prisma.types';
import { PaginationResult } from 'src/common/dto/pagination.dto';
import { Request } from 'express';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockUser = createMockUserEntity({ id: 1 });
  const mockRequest = createMockRequest();

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findAllByUserId: jest.fn(),
      findOne: jest.fn(),
      count: jest.fn(),
      lowStock: jest.fn(),
      mostConsumed: jest.fn(),
      countByCategory: jest.fn(),
      getMovementsByDate: jest.fn(),
      update: jest.fn(),
      updateStock: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um produto com sucesso', async () => {
      const createDto: CreateProductDto = {
        name: 'Arroz 5kg',
        description: 'Arroz tipo 1',
        unit: Unit.kg,
        categoryId: 1,
        currentQuantity: 0,
        desiredQuantity: 10,
      };

      const mockProduct: ProductWithRelations = {
        id: 1,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: createDto.name,
        description: createDto.description,
        unit: createDto.unit,
        categoryId: createDto.categoryId,
        category: {
          id: createDto.categoryId,
          name: 'Categoria Teste',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        stock: {
          id: 1,
          productId: 1,
          currentQuantity: 0,
          desiredQuantity: 10,
          updatedAt: new Date(),
        },
        movements: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockProduct);

      const result = await controller.create(createDto, mockUser);

      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });

    it('deve propagar erro quando service lança exceção', async () => {
      const createDto: CreateProductDto = {
        name: 'Arroz 5kg',
        unit: Unit.kg,
        categoryId: 1,
        currentQuantity: 0,
        desiredQuantity: 10,
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(
          new UnprocessableEntityException('Categoria não encontrada.'),
        );

      await expect(controller.create(createDto, mockUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
    });
  });

  describe('findAll', () => {
    it('deve retornar produtos paginados', async () => {
      const query = { page: 1, perPage: 10 };
      const mockResult: PaginationResult<ProductWithRelations> = {
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
          from: 0,
          to: 0,
        },
        links: {
          self: '/products?page=1&perPage=10',
          next: null,
          prev: null,
          first: '/products?page=1&perPage=10',
          last: '/products?page=1&perPage=10',
        },
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll(
        query,
        mockUser,
        mockRequest as Request,
      );

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(
        mockUser,
        query,
        mockRequest,
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um produto quando encontrado', async () => {
      const productId = '1';
      const mockProduct = {
        id: 1,
        name: 'Arroz 5kg',
        userId: mockUser.id,
      };

      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockProduct as ProductWithRelations);

      const result = await controller.findOne(productId, mockUser);

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
    });

    it('deve propagar NotFoundException quando produto não encontrado', async () => {
      const productId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(productId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('count', () => {
    it('deve retornar contagem de produtos', async () => {
      const mockCount = { count: 5 };

      jest.spyOn(service, 'count').mockResolvedValue(mockCount);

      const result = await controller.count(mockUser);

      expect(result).toEqual(mockCount);
      expect(service.count).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('lowStock', () => {
    it('deve retornar produtos com estoque baixo', async () => {
      const mockProducts: (Product & {
        stock: {
          id: number;
          productId: number;
          currentQuantity: number;
          desiredQuantity: number;
          updatedAt: Date;
        } | null;
      })[] = [
        {
          id: 1,
          userId: mockUser.id,
          name: 'Produto 1',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: {
            id: 1,
            productId: 1,
            currentQuantity: 2,
            desiredQuantity: 10,
            updatedAt: new Date(),
          },
        },
      ];

      jest.spyOn(service, 'lowStock').mockResolvedValue(mockProducts);

      const result = await controller.lowStock(mockUser);

      expect(result).toEqual(mockProducts);
      expect(service.lowStock).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('mostConsumed', () => {
    it('deve retornar produto mais consumido', async () => {
      const query: MostConsumedDto = { month: 5, year: 2024 };
      const mockResult = {
        product: 'Arroz 5kg',
        quantity: 100,
        unit: Unit.kg,
        percentageChange: 25,
      };

      jest.spyOn(service, 'mostConsumed').mockResolvedValue(mockResult);

      const result = await controller.mostConsumed(query, mockUser);

      expect(result).toEqual(mockResult);
      expect(service.mostConsumed).toHaveBeenCalledWith(query, mockUser);
    });

    it('deve retornar array vazio quando não há dados', async () => {
      const query: MostConsumedDto = { month: 5, year: 2024 };

      jest.spyOn(service, 'mostConsumed').mockResolvedValue([]);

      const result = await controller.mostConsumed(query, mockUser);

      expect(result).toEqual([]);
    });
  });

  describe('getProductsCountByCategory', () => {
    it('deve retornar contagem por categoria', async () => {
      const mockResult = [
        { name: 'Categoria 1', count: 5 },
        { name: 'Categoria 2', count: 3 },
      ];

      jest.spyOn(service, 'countByCategory').mockResolvedValue(mockResult);

      const result = await controller.getProductsCountByCategory(mockUser);

      expect(result).toEqual(mockResult);
      expect(service.countByCategory).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('getMovements', () => {
    it('deve retornar movimentações agrupadas', async () => {
      const dto: GetStockMovementsDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        groupBy: 'day',
      };

      const mockResult = [
        { date: '2024-01-15', IN: 10, OUT: 5 },
        { date: '2024-01-16', IN: 20, OUT: 0 },
      ];

      jest.spyOn(service, 'getMovementsByDate').mockResolvedValue(mockResult);

      const result = await controller.getMovements(dto, mockUser);

      expect(result).toEqual(mockResult);
      expect(service.getMovementsByDate).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('update', () => {
    it('deve atualizar um produto com sucesso', async () => {
      const productId = '1';
      const updateDto: UpdateProductDto = {
        name: 'Arroz 10kg',
        description: 'Arroz tipo 1 atualizado',
        unit: Unit.kg,
        categoryId: 1,
      };

      const mockUpdatedProduct = {
        id: 1,
        ...updateDto,
        userId: mockUser.id,
      };

      jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockUpdatedProduct as Product);

      const result = await controller.update(productId, updateDto, mockUser);

      expect(result).toEqual(mockUpdatedProduct);
      expect(service.update).toHaveBeenCalledWith(1, updateDto, mockUser);
    });

    it('deve propagar ConflictException quando produto duplicado', async () => {
      const productId = '1';
      const updateDto: UpdateProductDto = {
        name: 'Arroz 10kg',
        unit: Unit.kg,
        categoryId: 1,
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new ConflictException('Já existe um produto com o mesmo nome.'),
        );

      await expect(
        controller.update(productId, updateDto, mockUser),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updateStock', () => {
    it('deve atualizar estoque com sucesso (tipo IN)', async () => {
      const productId = '1';
      const updateStockDto: UpdateProductStockDto = {
        quantity: 5,
        type: 'IN',
      };

      const mockResult = {
        id: 1,
        updateStockDto,
        user: mockUser,
        product: {
          id: 1,
          userId: mockUser.id,
          name: 'Produto Teste',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: {
            id: 1,
            productId: 1,
            currentQuantity: 5,
            desiredQuantity: 10,
            updatedAt: new Date(),
          },
        } as ProductWithRelations,
        stockMovement: {
          id: 1,
          productId: 1,
          stockId: 1,
          quantity: 5,
          movementType: 'IN' as const,
          description: null as string | null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      jest.spyOn(service, 'updateStock').mockResolvedValue(mockResult);

      const result = await controller.updateStock(
        productId,
        updateStockDto,
        mockUser,
      );

      expect(result).toEqual(mockResult);
      expect(service.updateStock).toHaveBeenCalledWith(
        1,
        updateStockDto,
        mockUser,
      );
    });

    it('deve propagar BadRequestException quando quantidade insuficiente', async () => {
      const productId = '1';
      const updateStockDto: UpdateProductStockDto = {
        quantity: 100,
        type: 'OUT',
      };

      jest
        .spyOn(service, 'updateStock')
        .mockRejectedValue(
          new BadRequestException('Quantidade insuficiente para remoção'),
        );

      await expect(
        controller.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve propagar NotFoundException quando produto não encontrado', async () => {
      const productId = '999';
      const updateStockDto: UpdateProductStockDto = {
        quantity: 5,
        type: 'IN',
      };

      jest
        .spyOn(service, 'updateStock')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve retornar mensagem de remoção', async () => {
      const productId = '1';
      const mockResult = 'This action removes a #1 product';

      jest.spyOn(service, 'remove').mockResolvedValue(mockResult);

      const result = await controller.remove(productId);

      expect(result).toBe(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findAllInternal', () => {
    it('deve retornar produtos por userId (rota interna)', async () => {
      const userId = '1';
      const mockProducts = [
        {
          id: 1,
          name: 'Produto 1',
          userId: 1,
        },
      ];

      jest
        .spyOn(service, 'findAllByUserId')
        .mockResolvedValue(mockProducts as ProductWithRelations[]);

      const result = await controller.findAllInternal(userId);

      expect(result).toEqual(mockProducts);
      expect(service.findAllByUserId).toHaveBeenCalledWith(1);
    });
  });
});
