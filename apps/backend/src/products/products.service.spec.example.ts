/**
 * EXEMPLO DE TESTE CORRIGIDO PARA ProductsService
 * 
 * Este arquivo serve como referência de como implementar testes unitários
 * corretos com mocks adequados. Use este exemplo como base para corrigir
 * os outros testes do projeto.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { UnprocessableEntityException, NotFoundException, BadRequestException } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  createMockPrismaService,
  createMockPaginationService,
  createMockUserEntity,
} from 'src/common/test-helpers/mock-factories';

describe('ProductsService', () => {
  let service: ProductsService;
  let prismaService: jest.Mocked<PrismaService>;
  let paginationService: jest.Mocked<PaginationService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();
    const mockPagination = createMockPaginationService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaginationService, useValue: mockPagination },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
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
    const createDto: CreateProductDto = {
      name: 'Arroz 5kg',
      description: 'Arroz tipo 1',
      unit: Unit.kg,
      categoryId: 1,
      currentQuantity: 0,
      desiredQuantity: 10,
    };

    const mockUser = createMockUserEntity({ id: 1 });

    it('deve criar um produto com sucesso', async () => {
      // Arrange
      const mockProduct = {
        id: 1,
        name: createDto.name,
        description: createDto.description,
        unit: createDto.unit,
        categoryId: createDto.categoryId,
        userId: mockUser.id,
        category: { id: 1, name: 'Categoria Teste' },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockStock = {
        id: 1,
        productId: 1,
        currentQuantity: createDto.currentQuantity,
        desiredQuantity: createDto.desiredQuantity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest.fn().mockResolvedValue({ id: 1, name: 'Categoria Teste' }),
          },
          product: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockProduct),
          },
          stock: {
            create: jest.fn().mockResolvedValue(mockStock),
          },
        };
        return callback(trx as any);
      });

      // Act
      const result = await service.create(createDto, mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.stock).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve lançar UnprocessableEntityException quando categoria não existe', async () => {
      // Arrange
      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(trx as any);
      });

      // Act & Assert
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Categoria não encontrada.',
      );
    });

    it('deve lançar UnprocessableEntityException quando produto já existe', async () => {
      // Arrange
      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest.fn().mockResolvedValue({ id: 1, name: 'Categoria Teste' }),
          },
          product: {
            findFirst: jest.fn().mockResolvedValue({ id: 1, name: createDto.name }),
          },
        };
        return callback(trx as any);
      });

      // Act & Assert
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Já existe um produto com o mesmo nome.',
      );
    });
  });

  describe('findOne', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar um produto quando encontrado', async () => {
      // Arrange
      const productId = 1;
      const mockProduct = {
        id: productId,
        name: 'Arroz 5kg',
        description: 'Arroz tipo 1',
        unit: Unit.kg,
        categoryId: 1,
        userId: mockUser.id,
        category: { id: 1, name: 'Categoria Teste' },
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 5,
          desiredQuantity: 10,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(mockProduct as any);

      // Act
      const result = await service.findOne(productId, mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(productId);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId, userId: mockUser.id },
        include: { category: true, stock: true },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      // Arrange
      const productId = 999;
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(service.findOne(productId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStock', () => {
    const mockUser = createMockUserEntity({ id: 1 });
    const productId = 1;

    it('deve adicionar estoque corretamente (tipo IN)', async () => {
      // Arrange
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 5,
          desiredQuantity: 10,
        },
      };

      const updateStockDto = {
        quantity: 3,
        type: 'IN' as const,
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct),
          },
          stock: {
            update: jest.fn().mockResolvedValue({
              ...mockProduct.stock,
              currentQuantity: 8,
            }),
          },
          stockMovement: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              productId: productId,
              stockId: 1,
              quantity: 3,
              movementType: 'IN',
            }),
          },
        };
        return callback(trx as any);
      });

      // Act
      const result = await service.updateStock(productId, updateStockDto, mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve remover estoque corretamente (tipo OUT)', async () => {
      // Arrange
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 10,
          desiredQuantity: 10,
        },
      };

      const updateStockDto = {
        quantity: 3,
        type: 'OUT' as const,
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct),
          },
          stock: {
            update: jest.fn().mockResolvedValue({
              ...mockProduct.stock,
              currentQuantity: 7,
            }),
          },
          stockMovement: {
            create: jest.fn().mockResolvedValue({
              id: 1,
              productId: productId,
              stockId: 1,
              quantity: 3,
              movementType: 'OUT',
            }),
          },
        };
        return callback(trx as any);
      });

      // Act
      const result = await service.updateStock(productId, updateStockDto, mockUser);

      // Assert
      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando quantidade insuficiente para remoção', async () => {
      // Arrange
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 2,
          desiredQuantity: 10,
        },
      };

      const updateStockDto = {
        quantity: 5,
        type: 'OUT' as const,
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct),
          },
        };
        return callback(trx as any);
      });

      // Act & Assert
      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow('Quantidade insuficiente para remoção');
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      // Arrange
      const updateStockDto = {
        quantity: 5,
        type: 'IN' as const,
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(trx as any);
      });

      // Act & Assert
      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('count', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar a contagem de produtos do usuário', async () => {
      // Arrange
      const expectedCount = 5;
      (prismaService.product.count as jest.Mock).mockResolvedValue(expectedCount);

      // Act
      const result = await service.count(mockUser);

      // Assert
      expect(result).toEqual({ count: expectedCount });
      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });
  });

  describe('lowStock', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar produtos com estoque baixo', async () => {
      // Arrange
      const mockProducts = [
        {
          id: 1,
          name: 'Produto 1',
          stock: {
            id: 1,
            currentQuantity: 2,
            desiredQuantity: 10, // 2 < 10 * 0.4 = 4
          },
        },
        {
          id: 2,
          name: 'Produto 2',
          stock: {
            id: 2,
            currentQuantity: 5,
            desiredQuantity: 10, // 5 >= 10 * 0.4 = 4
          },
        },
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(mockProducts as any);

      // Act
      const result = await service.lowStock(mockUser);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { stock: true },
      });
    });
  });
});



