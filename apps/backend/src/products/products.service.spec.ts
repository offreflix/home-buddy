import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';
import {
  UnprocessableEntityException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import {
  Unit,
  StockMovement,
  MovementType,
  Product,
  Stock,
} from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { MostConsumedDto } from './dto/most-consumed.dto';
import { GetStockMovementsDto } from './dto/get-stock-movements.dto';
import {
  createMockPrismaService,
  createMockPaginationService,
  createMockUser,
  createMockUserEntity,
  createMockRequest,
} from 'src/common/test-helpers/mock-factories';
import { ProductWithRelations } from 'src/common/types/prisma.types';
import { PaginationResult } from 'src/common/dto/pagination.dto';
import {
  createMockProduct,
  createMockCategory,
  createMockStock,
  createMockStockMovement,
} from 'src/common/test-helpers/mock-factories';
import { MockPrismaTransaction } from 'src/common/test-helpers/test-types';
import { Request } from 'express';

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
            findFirst: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Categoria Teste' }),
          },
          product: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(mockProduct),
          },
          stock: {
            create: jest.fn().mockResolvedValue(mockStock),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.create(createDto, mockUser);

      expect(result).toBeDefined();
      expect(result.name).toBe(createDto.name);
      expect(result.stock).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve lançar UnprocessableEntityException quando categoria não existe', async () => {
      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Categoria não encontrada.',
      );
    });

    it('deve lançar UnprocessableEntityException quando produto já existe', async () => {
      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Categoria Teste' }),
          },
          product: {
            findFirst: jest
              .fn()
              .mockResolvedValue({ id: 1, name: createDto.name }),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        UnprocessableEntityException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Já existe um produto com o mesmo nome.',
      );
    });

    it('deve lançar BadRequestException quando há erro ao criar produto ou estoque', async () => {
      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          category: {
            findFirst: jest
              .fn()
              .mockResolvedValue({ id: 1, name: 'Categoria Teste' }),
          },
          product: {
            findFirst: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockRejectedValue(new Error('Database error')),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto, mockUser)).rejects.toThrow(
        'Erro ao criar o produto ou o estoque.',
      );
    });
  });

  describe('findAll', () => {
    const mockUser = createMockUserEntity({ id: 1 });
    const mockRequest = createMockRequest();

    it('deve retornar produtos paginados com sucesso', async () => {
      const mockProducts: ProductWithRelations[] = [
        createMockProduct({
          id: 1,
          name: 'Produto 1',
          category: createMockCategory({ id: 1, name: 'Categoria 1' }),
          stock: createMockStock({ id: 1, currentQuantity: 10 }),
        }),
      ];

      const mockTotal = 1;
      const mockPaginationResult: PaginationResult<ProductWithRelations> = {
        data: mockProducts,
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
          self: 'http://localhost/products?page=1&perPage=10',
          next: null,
          prev: null,
          first: 'http://localhost/products?page=1&perPage=10',
          last: 'http://localhost/products?page=1&perPage=10',
        },
      };

      (prismaService.product.count as jest.Mock).mockResolvedValue(mockTotal);
      (prismaService.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts,
      );
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
      paginationService.createPaginatedResponse.mockReturnValue(
        mockPaginationResult,
      );

      const result = await service.findAll(
        mockUser,
        {},
        mockRequest as Request,
      );

      expect(result).toEqual(mockPaginationResult);
      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });

    it('deve configurar ordenação correta para stock.currentQuantity', async () => {
      paginationService.createPaginationOptions.mockReturnValue({
        page: 1,
        perPage: 10,
        sortBy: 'stock.currentQuantity',
        sortOrder: 'asc',
      });
      paginationService.getPrismaPaginationOptions.mockReturnValue({
        skip: 0,
        take: 10,
        orderBy: {},
      });

      (prismaService.product.count as jest.Mock).mockResolvedValue(0);
      (prismaService.product.findMany as jest.Mock).mockResolvedValue([]);
      paginationService.createPaginatedResponse.mockReturnValue({
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          from: 0,
          to: 0,
        },
        links: {
          self: '',
          next: null,
          prev: null,
          first: '',
          last: '',
        },
      } as PaginationResult<ProductWithRelations>);

      await service.findAll(
        mockUser,
        { sortBy: 'stock.currentQuantity', sortOrder: 'asc' },
        mockRequest as Request,
      );

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            stock: {
              currentQuantity: 'asc',
            },
          },
        }),
      );
    });

    it('deve configurar ordenação correta para category.name', async () => {
      paginationService.createPaginationOptions.mockReturnValue({
        page: 1,
        perPage: 10,
        sortBy: 'category.name',
        sortOrder: 'asc',
      });
      paginationService.getPrismaPaginationOptions.mockReturnValue({
        skip: 0,
        take: 10,
        orderBy: {},
      });

      (prismaService.product.count as jest.Mock).mockResolvedValue(0);
      (prismaService.product.findMany as jest.Mock).mockResolvedValue([]);
      paginationService.createPaginatedResponse.mockReturnValue({
        data: [],
        meta: {
          page: 1,
          perPage: 10,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          from: 0,
          to: 0,
        },
        links: {
          self: '',
          next: null,
          prev: null,
          first: '',
          last: '',
        },
      } as PaginationResult<ProductWithRelations>);

      await service.findAll(
        mockUser,
        { sortBy: 'category.name', sortOrder: 'asc' },
        mockRequest as Request,
      );

      expect(prismaService.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: {
            category: {
              name: 'asc',
            },
          },
        }),
      );
    });
  });

  describe('findAllByUserId', () => {
    it('deve retornar todos os produtos de um usuário', async () => {
      const userId = 1;
      const mockProducts: ProductWithRelations[] = [
        createMockProduct({
          id: 1,
          name: 'Produto 1',
          userId,
          category: createMockCategory({ id: 1, name: 'Categoria 1' }),
          stock: createMockStock({ id: 1, currentQuantity: 10 }),
        }),
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts,
      );

      const result = await service.findAllByUserId(userId);

      expect(result).toEqual(mockProducts);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { userId },
        include: { category: true, stock: true, movements: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar um produto quando encontrado', async () => {
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

      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(
        mockProduct,
      );

      const result = await service.findOne(productId, mockUser);

      expect(result).toBeDefined();
      expect(result.id).toBe(productId);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id: productId, userId: mockUser.id },
        include: { category: true, stock: true },
      });
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      const productId = 999;
      (prismaService.product.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(productId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('count', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar a contagem de produtos do usuário', async () => {
      const expectedCount = 5;
      (prismaService.product.count as jest.Mock).mockResolvedValue(
        expectedCount,
      );

      const result = await service.count(mockUser);

      expect(result).toEqual({ count: expectedCount });
      expect(prismaService.product.count).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });
  });

  describe('lowStock', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar produtos com estoque baixo (menor que 40% do desejado)', async () => {
      type ProductWithStock = Product & { stock: Stock | null };
      const mockProducts: ProductWithStock[] = [
        {
          id: 1,
          name: 'Produto 1',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: createMockStock({
            id: 1,
            currentQuantity: 2,
            desiredQuantity: 10, // 2 < 10 * 0.4 = 4
          }),
        },
        {
          id: 2,
          name: 'Produto 2',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: createMockStock({
            id: 2,
            currentQuantity: 5,
            desiredQuantity: 10, // 5 >= 10 * 0.4 = 4
          }),
        },
        {
          id: 3,
          name: 'Produto 3',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: null,
        },
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts,
      );

      const result = await service.lowStock(mockUser);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(1);
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        include: { stock: true },
      });
    });

    it('deve retornar array vazio quando não há produtos com estoque baixo', async () => {
      type ProductWithStock = Product & { stock: Stock | null };
      const mockProducts: ProductWithStock[] = [
        {
          id: 1,
          name: 'Produto 1',
          description: null,
          unit: Unit.kg,
          categoryId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          stock: createMockStock({
            id: 1,
            currentQuantity: 5,
            desiredQuantity: 10, // 5 >= 4
          }),
        },
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(
        mockProducts,
      );

      const result = await service.lowStock(mockUser);

      expect(result).toHaveLength(0);
    });
  });

  describe('mostConsumed', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar o produto mais consumido do mês', async () => {
      const dto: MostConsumedDto = { month: 5, year: 2024 };
      const productId = 1;
      const currentMonthTotal = 100;
      const previousMonthTotal = 80;

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          stockMovement: {
            groupBy: jest.fn().mockResolvedValue([
              {
                productId,
                _sum: { quantity: currentMonthTotal },
              },
            ]),
            aggregate: jest.fn().mockResolvedValue({
              _sum: { quantity: previousMonthTotal },
            }),
          },
          product: {
            findUnique: jest.fn().mockResolvedValue({
              id: productId,
              name: 'Arroz 5kg',
              unit: Unit.kg,
              category: { id: 1, name: 'Categoria' },
            }),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.mostConsumed(dto, mockUser);

      expect(result).not.toEqual([]);
      if (Array.isArray(result)) {
        expect(result).toHaveLength(0);
      } else {
        expect(result.product).toBe('Arroz 5kg');
        expect(result.quantity).toBe(currentMonthTotal);
        expect(result.percentageChange).toBeCloseTo(25, 1); // (100-80)/80 * 100 = 25
      }
    });

    it('deve retornar array vazio quando não há movimentações no mês', async () => {
      const dto: MostConsumedDto = { month: 5, year: 2024 };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          stockMovement: {
            groupBy: jest.fn().mockResolvedValue([]),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.mostConsumed(dto, mockUser);

      expect(result).toEqual([]);
    });

    it('deve calcular percentageChange como 100 quando mês anterior não tem dados', async () => {
      const dto: MostConsumedDto = { month: 5, year: 2024 };
      const productId = 1;
      const currentMonthTotal = 100;

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          stockMovement: {
            groupBy: jest.fn().mockResolvedValue([
              {
                productId,
                _sum: { quantity: currentMonthTotal },
              },
            ]),
            aggregate: jest.fn().mockResolvedValue({
              _sum: { quantity: 0 },
            }),
          },
          product: {
            findUnique: jest.fn().mockResolvedValue({
              id: productId,
              name: 'Arroz 5kg',
              unit: Unit.kg,
              category: { id: 1, name: 'Categoria' },
            }),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.mostConsumed(dto, mockUser);

      expect(result).not.toEqual([]);
      if (!Array.isArray(result)) {
        expect(result.percentageChange).toBe(100);
      }
    });
  });

  describe('countByCategory', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar contagem de produtos por categoria', async () => {
      type CategoryWithCount = {
        id: number;
        name: string;
        _count: { products: number };
      };
      const mockCategories: CategoryWithCount[] = [
        {
          id: 1,
          name: 'Categoria 1',
          _count: { products: 5 },
        },
        {
          id: 2,
          name: 'Categoria 2',
          _count: { products: 3 },
        },
      ];

      (prismaService.category.findMany as jest.Mock).mockResolvedValue(
        mockCategories,
      );

      const result = await service.countByCategory(mockUser);

      expect(result).toEqual([
        { id: 1, name: 'Categoria 1', count: 5 },
        { id: 2, name: 'Categoria 2', count: 3 },
      ]);
      expect(prismaService.category.findMany).toHaveBeenCalledWith({
        where: {
          products: {
            some: {
              userId: mockUser.id,
            },
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      });
    });
  });

  describe('getMovementsByDate', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve retornar movimentações agrupadas por dia', async () => {
      const dto: GetStockMovementsDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        groupBy: 'day',
      };

      const mockMovements: StockMovement[] = [
        createMockStockMovement({
          id: 1,
          productId: 1,
          movementType: 'IN',
          quantity: 10,
          createdAt: new Date('2024-01-15T10:00:00Z'),
        }),
        createMockStockMovement({
          id: 2,
          productId: 1,
          movementType: 'OUT',
          quantity: 5,
          createdAt: new Date('2024-01-15T11:00:00Z'),
        }),
        createMockStockMovement({
          id: 3,
          productId: 2,
          movementType: 'IN',
          quantity: 20,
          createdAt: new Date('2024-01-16T10:00:00Z'),
        }),
      ];

      (prismaService.stockMovement.findMany as jest.Mock).mockResolvedValue(
        mockMovements,
      );

      const result = await service.getMovementsByDate(dto, mockUser);

      expect(result).not.toEqual([]);
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result) && result.length > 0) {
        expect(result[0]).toHaveProperty('date');
        expect(result[0]).toHaveProperty('IN');
        expect(result[0]).toHaveProperty('OUT');
      }
    });

    it('deve retornar movimentações agrupadas por mês', async () => {
      const dto: GetStockMovementsDto = {
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        groupBy: 'month',
      };

      const mockMovements: StockMovement[] = [
        createMockStockMovement({
          id: 1,
          productId: 1,
          movementType: 'IN',
          quantity: 10,
          createdAt: new Date('2024-01-15T10:00:00Z'),
        }),
        createMockStockMovement({
          id: 2,
          productId: 1,
          movementType: 'OUT',
          quantity: 5,
          createdAt: new Date('2024-02-15T10:00:00Z'),
        }),
      ];

      (prismaService.stockMovement.findMany as jest.Mock).mockResolvedValue(
        mockMovements,
      );

      const result = await service.getMovementsByDate(dto, mockUser);

      expect(result).not.toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('deve retornar array vazio quando não há movimentações', async () => {
      const dto: GetStockMovementsDto = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        groupBy: 'day',
      };

      (prismaService.stockMovement.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.getMovementsByDate(dto, mockUser);

      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    const mockUser = createMockUserEntity({ id: 1 });

    it('deve atualizar um produto com sucesso', async () => {
      const productId = 1;
      const updateDto: UpdateProductDto = {
        name: 'Arroz 10kg',
        description: 'Arroz tipo 1 atualizado',
        unit: Unit.kg,
        categoryId: 1,
      };

      const mockUpdatedProduct = {
        id: productId,
        ...updateDto,
        userId: mockUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prismaService.product.findFirst as jest.Mock).mockResolvedValue(null);
      (prismaService.product.update as jest.Mock).mockResolvedValue(
        mockUpdatedProduct,
      );

      const result = await service.update(productId, updateDto, mockUser);

      expect(result).toBeDefined();
      expect(prismaService.product.findFirst).toHaveBeenCalledWith({
        where: {
          name: updateDto.name,
          userId: mockUser.id,
          id: { not: productId },
        },
      });
    });

    it('deve lançar ConflictException quando produto com mesmo nome já existe', async () => {
      const productId = 1;
      const updateDto: UpdateProductDto = {
        name: 'Arroz 10kg',
        description: 'Arroz tipo 1',
        unit: Unit.kg,
        categoryId: 1,
      };

      (prismaService.product.findFirst as jest.Mock).mockResolvedValue({
        id: 2,
        name: updateDto.name,
      } as Product);

      await expect(
        service.update(productId, updateDto, mockUser),
      ).rejects.toThrow(ConflictException);
      await expect(
        service.update(productId, updateDto, mockUser),
      ).rejects.toThrow('Já existe um produto com o mesmo nome.');
    });
  });

  describe('updateStock', () => {
    const mockUser = createMockUserEntity({ id: 1 });
    const productId = 1;

    it('deve adicionar estoque corretamente (tipo IN)', async () => {
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 5,
          desiredQuantity: 10,
        },
      };

      const updateStockDto: UpdateProductStockDto = {
        quantity: 3,
        type: 'IN',
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
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.updateStock(
        productId,
        updateStockDto,
        mockUser,
      );

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve remover estoque corretamente (tipo OUT)', async () => {
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 10,
          desiredQuantity: 10,
        },
      };

      const updateStockDto: UpdateProductStockDto = {
        quantity: 3,
        type: 'OUT',
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
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      const result = await service.updateStock(
        productId,
        updateStockDto,
        mockUser,
      );

      expect(result).toBeDefined();
      expect(prismaService.$transaction).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException quando quantidade insuficiente para remoção', async () => {
      const mockProduct = {
        id: productId,
        stock: {
          id: 1,
          productId: productId,
          currentQuantity: 2,
          desiredQuantity: 10,
        },
      };

      const updateStockDto: UpdateProductStockDto = {
        quantity: 5,
        type: 'OUT',
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow('Quantidade insuficiente para remoção');
    });

    it('deve lançar NotFoundException quando produto não encontrado', async () => {
      const updateStockDto: UpdateProductStockDto = {
        quantity: 5,
        type: 'IN',
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('deve lançar BadRequestException quando tipo de movimentação é inválido', async () => {
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
        quantity: 5,
        type: 'INVALID' as 'IN' | 'OUT',
      };

      prismaService.$transaction.mockImplementation(async (callback) => {
        const trx = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProduct),
          },
        };
        return callback(
          trx as unknown as Omit<
            PrismaService,
            '$connect' | '$disconnect' | '$on' | '$use' | '$transaction'
          >,
        );
      });

      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateStock(productId, updateStockDto, mockUser),
      ).rejects.toThrow('Tipo de movimentação inválido');
    });
  });

  describe('remove', () => {
    it('deve retornar mensagem de remoção', async () => {
      const productId = 1;
      const result = await service.remove(productId);

      expect(result).toBe(`This action removes a #${productId} product`);
    });
  });
});
