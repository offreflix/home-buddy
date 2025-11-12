import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { ExportProductsDto } from './dto/export-products.dto';
import { ProductWhereInput } from 'src/common/types/prisma.types';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportProductsAsCsv(
    user: UserEntity,
    dto: ExportProductsDto,
  ): Promise<string> {
    const whereClause: ProductWhereInput = {
      userId: user.id,
    };

    const products = await this.prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        stock: true,
      },
      orderBy: { name: 'asc' },
    });

    let filteredProducts = products;
    if (dto.lowStock) {
      filteredProducts = products.filter(
        (product) =>
          product.stock &&
          product.stock.currentQuantity < product.stock.desiredQuantity * 0.4,
      );
    }

    const headers = [
      'Nome',
      'Descrição',
      'Categoria',
      'Unidade',
      'Quantidade Atual',
      'Quantidade Desejada',
      'Status',
      'Criado em',
    ];

    const rows = filteredProducts.map((product) => {
      const stockStatus =
        product.stock.currentQuantity === 0
          ? 'Sem Estoque'
          : product.stock.currentQuantity < product.stock.desiredQuantity * 0.4
            ? 'Baixo Estoque'
            : product.stock.currentQuantity >= product.stock.desiredQuantity
              ? 'Estoque Cheio'
              : 'Estoque Médio';

      return [
        product.name,
        product.description || '',
        product.category.name,
        product.unit,
        product.stock.currentQuantity.toString(),
        product.stock.desiredQuantity.toString(),
        stockStatus,
        product.createdAt.toISOString().split('T')[0],
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  async generateStockSummaryReport(user: UserEntity) {
    const [
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalCategories,
    ] = await Promise.all([
      this.prisma.product.count({ where: { userId: user.id } }),
      this.prisma.product.count({
        where: {
          userId: user.id,
        },
      }),
      this.prisma.product.count({
        where: {
          userId: user.id,
          stock: { currentQuantity: 0 },
        },
      }),
      this.prisma.category.count({
        where: {
          products: {
            some: { userId: user.id },
          },
        },
      }),
    ]);

    const totalStockValue = await this.prisma.stock.aggregate({
      where: {
        product: { userId: user.id },
      },
      _sum: {
        currentQuantity: true,
        desiredQuantity: true,
      },
    });

    return {
      summary: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalCategories,
        totalStockQuantity: totalStockValue._sum.currentQuantity || 0,
        totalDesiredQuantity: totalStockValue._sum.desiredQuantity || 0,
      },
      generatedAt: new Date().toISOString(),
    };
  }
}
