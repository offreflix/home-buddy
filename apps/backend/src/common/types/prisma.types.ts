import { Prisma } from '@prisma/client';

// Tipo para Product com includes padrão
export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    category: true;
    stock: true;
    movements: true;
  };
}>;

// Tipo para Product com includes mínimos (sem movements)
export type ProductWithCategoryAndStock = Prisma.ProductGetPayload<{
  include: {
    category: true;
    stock: true;
  };
}>;

// Tipo para Category
export type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    products: true;
  };
}>;

// Tipo básico de Category
export type CategoryBasic = Prisma.CategoryGetPayload<{}>;

// Tipos para OrderBy do Prisma
export type ProductOrderBy = Prisma.ProductOrderByWithRelationInput;
export type CategoryOrderBy = Prisma.CategoryOrderByWithRelationInput;

// Tipos para WhereInput do Prisma
export type ProductWhereInput = Prisma.ProductWhereInput;
export type CategoryWhereInput = Prisma.CategoryWhereInput;


