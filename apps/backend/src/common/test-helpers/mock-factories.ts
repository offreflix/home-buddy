import { PrismaService } from 'src/prisma.service';
import { PaginationService } from 'src/common/services/pagination.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';
import { Request, Response } from 'express';
import { UserEntity } from 'src/users/entities/user.entity';
import { User, Product, Category, Stock, StockMovement, Unit } from '@prisma/client';
import { MockUser, MockProduct, MockCategory, MockStock } from './test-types';
import { ProductWithRelations } from 'src/common/types/prisma.types';

/**
 * Cria um mock do PrismaService para uso em testes
 */
export const createMockPrismaService = (): jest.Mocked<PrismaService> => {
  const mockTransaction = jest.fn();
  
  return {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['product']>,
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['category']>,
    stock: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['stock']>,
    stockMovement: {
      create: jest.fn(),
      findMany: jest.fn(),
      groupBy: jest.fn(),
      aggregate: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['stockMovement']>,
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['user']>,
    operationLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['operationLog']>,
    scrapingLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['scrapingLog']>,
    matchingLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['matchingLog']>,
    lLMLog: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<PrismaService['lLMLog']>,
    $transaction: mockTransaction,
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $on: jest.fn(),
    $use: jest.fn(),
  } as unknown as jest.Mocked<PrismaService>;
};

/**
 * Cria um mock do PaginationService para uso em testes
 */
export const createMockPaginationService = (): jest.Mocked<PaginationService> => {
  return {
    createPaginationOptions: jest.fn().mockReturnValue({
      page: 1,
      perPage: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc' as const,
    }),
    getPrismaPaginationOptions: jest.fn().mockReturnValue({
      skip: 0,
      take: 10,
      orderBy: { createdAt: 'desc' },
    }),
    createPaginatedResponse: jest.fn().mockImplementation((data, total, options, req) => ({
      data,
      meta: {
        page: options.page,
        perPage: options.perPage,
        total,
        totalPages: Math.ceil(total / options.perPage),
        hasNextPage: false,
        hasPrevPage: false,
        from: 1,
        to: Math.min(options.perPage, total),
      },
      links: {
        self: 'http://localhost/products?page=1&perPage=10',
        next: null,
        prev: null,
        first: 'http://localhost/products?page=1&perPage=10',
        last: 'http://localhost/products?page=1&perPage=10',
      },
    })),
    createPaginationMeta: jest.fn(),
    createPaginationLinks: jest.fn(),
    paginate: jest.fn(),
    getMaxUnlimitedItems: jest.fn().mockReturnValue(1000),
  } as unknown as jest.Mocked<PaginationService>;
};

/**
 * Cria um mock de User (Prisma) para uso em testes
 */
export const createMockUser = (overrides?: Partial<User>): MockUser => {
  return {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLoginAt: null,
    googleId: null,
    picture: null,
    ...overrides,
  } as MockUser;
};

/**
 * Cria um mock de UserEntity para uso em testes
 */
export const createMockUserEntity = (overrides?: Partial<UserEntity>): UserEntity => {
  return new UserEntity(
    overrides?.id || 1,
    overrides?.username || 'testuser',
  );
};

/**
 * Cria um mock do JwtService para uso em testes
 */
export const createMockJwtService = (): jest.Mocked<JwtService> => {
  return {
    sign: jest.fn().mockReturnValue('mock-access-token'),
    signAsync: jest.fn().mockResolvedValue('mock-access-token'),
    verify: jest.fn().mockReturnValue({ sub: 1, username: 'testuser', jti: 'mock-jti' }),
    verifyAsync: jest.fn().mockResolvedValue({ sub: 1, username: 'testuser', jti: 'mock-jti' }),
    decode: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;
};

/**
 * Cria um mock do RedisService para uso em testes
 */
export const createMockRedisService = (): jest.Mocked<RedisService> => {
  return {
    setToken: jest.fn().mockResolvedValue(undefined),
    getToken: jest.fn().mockResolvedValue(null),
    removeToken: jest.fn().mockResolvedValue(undefined),
    addUserSession: jest.fn().mockResolvedValue(undefined),
    removeUserSession: jest.fn().mockResolvedValue(undefined),
  } as unknown as jest.Mocked<RedisService>;
};

/**
 * Cria um mock de Request do Express para uso em testes
 */
export const createMockRequest = (overrides?: Partial<Request>): Partial<Request> => {
  return {
    protocol: 'http',
    get: jest.fn().mockReturnValue('localhost:3000'),
    path: '/products',
    query: {},
    params: {},
    body: {},
    headers: {},
    ...overrides,
  } as Partial<Request>;
};

/**
 * Cria um mock de Response do Express para uso em testes
 */
export const createMockResponse = (): jest.Mocked<Response> => {
  const res = {
    cookie: jest.fn().mockReturnThis(),
    clearCookie: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
  return res;
};

/**
 * Cria um mock de bcrypt para uso em testes
 */
export const mockBcrypt = {
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
};

/**
 * Cria um mock de Product com relações
 */
export const createMockProduct = (overrides?: Partial<ProductWithRelations>): ProductWithRelations => {
  const now = new Date();
  return {
    id: 1,
    name: 'Produto Teste',
    description: 'Descrição do produto',
    unit: Unit.kg,
    categoryId: 1,
    userId: 1,
    createdAt: now,
    updatedAt: now,
    category: {
      id: 1,
      name: 'Categoria Teste',
      createdAt: now,
      updatedAt: now,
    },
    stock: {
      id: 1,
      productId: 1,
      currentQuantity: 10,
      desiredQuantity: 20,
      updatedAt: now,
    },
    movements: [],
    ...overrides,
  } as ProductWithRelations;
};

/**
 * Cria um mock de Category
 */
export const createMockCategory = (overrides?: Partial<Category>): Category => {
  const now = new Date();
  return {
    id: 1,
    name: 'Categoria Teste',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Cria um mock de Stock
 */
export const createMockStock = (overrides?: Partial<Stock>): Stock => {
  const now = new Date();
  return {
    id: 1,
    productId: 1,
    currentQuantity: 10,
    desiredQuantity: 20,
    updatedAt: now,
    ...overrides,
  };
};

/**
 * Cria um mock de StockMovement
 */
export const createMockStockMovement = (overrides?: Partial<StockMovement>): StockMovement => {
  const now = new Date();
  return {
    id: 1,
    productId: 1,
    stockId: 1,
    movementType: 'IN' as const,
    quantity: 10,
    description: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
};

