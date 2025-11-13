import { User, Product, Category, Stock, StockMovement, OperationLog } from '@prisma/client';
import { ProductWithRelations, CategoryBasic } from 'src/common/types/prisma.types';
import { PaginationResult } from 'src/common/dto/pagination.dto';
import { AuthenticatedUser } from 'src/auth/auth.controller';

/**
 * Tipo para User completo do Prisma (com todas as propriedades)
 */
export type MockUser = User;

/**
 * Tipo para Product com relações
 */
export type MockProduct = ProductWithRelations;

/**
 * Tipo para Product básico
 */
export type MockProductBasic = Product;

/**
 * Tipo para Category
 */
export type MockCategory = CategoryBasic;

/**
 * Tipo para Stock
 */
export type MockStock = Stock;

/**
 * Tipo para StockMovement
 */
export type MockStockMovement = StockMovement;

/**
 * Tipo para OperationLog
 */
export type MockOperationLog = OperationLog;

/**
 * Tipo para resposta paginada
 */
export type MockPaginationResult<T> = PaginationResult<T>;

/**
 * Tipo para AuthenticatedUser
 */
export type MockAuthenticatedUser = AuthenticatedUser;

/**
 * Tipo para dados de criação de produto
 */
export interface MockCreateProductData {
  name: string;
  description?: string;
  unit: string;
  categoryId: number;
  currentQuantity: number;
  desiredQuantity: number;
}

/**
 * Tipo para dados de atualização de produto
 */
export interface MockUpdateProductData {
  name?: string;
  description?: string;
  unit?: string;
  categoryId?: number;
}

/**
 * Tipo para dados de atualização de estoque
 */
export interface MockUpdateStockData {
  quantity: number;
  type: 'IN' | 'OUT';
}

/**
 * Tipo para movimentações agrupadas
 */
export interface MockGroupedMovement {
  date: string;
  IN: number;
  OUT: number;
}

/**
 * Tipo para transação do Prisma (usado em testes)
 */
export type MockPrismaTransaction = {
  product: {
    findUnique: jest.Mock;
    findFirst: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
  };
  category: {
    findFirst: jest.Mock;
    findUnique: jest.Mock;
  };
  stock: {
    create: jest.Mock;
    update: jest.Mock;
  };
  stockMovement: {
    create: jest.Mock;
    groupBy: jest.Mock;
    aggregate: jest.Mock;
  };
};

