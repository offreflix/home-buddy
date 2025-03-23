import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { MostConsumedDto } from './dto/most-consumed.dto';
import { GetStockMovementsDto } from './dto/get-stock-movements.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: UserEntity) {
    try {
      return await this.prisma.$transaction(async (trx) => {
        const categoryExists = await trx.category.findFirst({
          where: { id: createProductDto.categoryId },
        });

        if (!categoryExists) {
          throw new UnprocessableEntityException('Categoria não encontrada.');
        }

        const productExists = await trx.product.findFirst({
          where: { name: createProductDto.name, userId: user.id },
        });

        if (productExists) {
          throw new UnprocessableEntityException(
            'Já existe um produto com o mesmo nome.',
          );
        }

        try {
          const product = await trx.product.create({
            data: {
              name: createProductDto.name,
              description: createProductDto.description,
              unit: createProductDto.unit,
              category: { connect: { id: createProductDto.categoryId } },
              user: { connect: { id: user.id } },
            },
            include: { category: true },
          });

          const stock = await trx.stock.create({
            data: {
              product: { connect: { id: product.id } },
              currentQuantity: createProductDto.currentQuantity,
              desiredQuantity: createProductDto.desiredQuantity,
            },
          });

          return { ...product, stock };
        } catch (error) {
          throw new BadRequestException(
            'Erro ao criar o produto ou o estoque.',
          );
        }
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll(user: UserEntity) {
    const products = await this.prisma.product.findMany({
      where: { userId: user.id },
      include: { category: true, stock: true, movements: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }

  async findOne(id: number, user: UserEntity) {
    const product = await this.prisma.product.findUnique({
      where: { id, userId: user.id },
      include: { category: true, stock: true },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async count(user: UserEntity) {
    const count = await this.prisma.product.count({
      where: { userId: user.id },
    });

    return { count };
  }

  async lowStock(user: UserEntity) {
    const products = await this.prisma.product.findMany({
      where: {
        userId: user.id,
      },
      include: {
        stock: true,
      },
    });

    const filteredProducts = products.filter(
      (product) =>
        product.stock &&
        product.stock.currentQuantity < product.stock.desiredQuantity * 0.4,
    );

    return filteredProducts;
  }

  async mostConsumed(dto: MostConsumedDto, user: UserEntity) {
    const { month, year } = dto;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    try {
      return await this.prisma.$transaction(async (trx) => {
        const mostConsumed = await trx.stockMovement.groupBy({
          by: ['productId'],
          where: {
            movementType: 'OUT',
            createdAt: { gte: startDate, lt: endDate },
            product: { userId: user.id },
          },
          _sum: { quantity: true },
          orderBy: { _sum: { quantity: 'desc' } },
          take: 1,
        });

        if (mostConsumed.length === 0) {
          return [];
        }

        const productId = mostConsumed[0].productId;
        const currentMonthTotal = mostConsumed[0]._sum.quantity || 0;

        const prevMonthDate = new Date(year, month - 2, 1);
        const prevStartDate = new Date(
          prevMonthDate.getFullYear(),
          prevMonthDate.getMonth(),
          1,
        );
        const prevEndDate = new Date(
          prevMonthDate.getFullYear(),
          prevMonthDate.getMonth() + 1,
          1,
        );

        const prevMonthConsumed = await trx.stockMovement.aggregate({
          where: {
            productId,
            movementType: 'OUT',
            createdAt: { gte: prevStartDate, lt: prevEndDate },
          },
          _sum: { quantity: true },
        });

        const previousMonthTotal = prevMonthConsumed._sum.quantity || 0;

        let percentageChange = 0;
        if (previousMonthTotal !== 0) {
          percentageChange =
            ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) *
            100;
        } else if (currentMonthTotal > 0) {
          percentageChange = 100;
        }

        const product = await trx.product.findUnique({
          where: { id: productId },
          include: { category: true },
        });

        return {
          product: product.name,
          quantity: currentMonthTotal,
          unit: product.unit,
          percentageChange: Number(percentageChange.toFixed(2)),
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async countByCategory(user: UserEntity) {
    const categories = await this.prisma.category.findMany({
      where: {
        products: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    const result = categories.map((category) => ({
      name: category.name,
      count: category._count.products,
    }));

    return result;
  }

  async getMovementsByDate(dto: GetStockMovementsDto, user: UserEntity) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    const movements = await this.prisma.stockMovement.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        product: {
          userId: user.id,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (!movements.length) {
      return [];
    }

    const groupedData: Record<
      string,
      { date: string; IN: number; OUT: number }
    > = {};

    movements.forEach((movement) => {
      const dateKey = movement.createdAt.toISOString().split('T')[0];
      if (!groupedData[dateKey]) {
        groupedData[dateKey] = { date: dateKey, IN: 0, OUT: 0 };
      }
      if (movement.movementType === 'IN') {
        groupedData[dateKey].IN += movement.quantity;
      } else if (movement.movementType === 'OUT') {
        groupedData[dateKey].OUT += movement.quantity;
      }
    });

    const result = Object.values(groupedData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return result;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    user: UserEntity,
  ) {
    const productExists = await this.prisma.product.findFirst({
      where: {
        name: updateProductDto.name,
        userId: user.id,
        id: { not: id },
      },
    });

    if (productExists) {
      throw new ConflictException('Já existe um produto com o mesmo nome.');
    }

    const product = this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        description: updateProductDto.description,
        unit: updateProductDto.unit,
        categoryId: updateProductDto.categoryId,
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }

  async updateStock(
    id: number,
    updateStockDto: UpdateProductStockDto,
    user: UserEntity,
  ) {
    try {
      return await this.prisma.$transaction(async (trx) => {
        const product = await trx.product.findUnique({
          where: { id },
          include: { stock: true },
        });

        if (!product) {
          throw new NotFoundException();
        }

        let newQuantity: number;

        switch (updateStockDto.type) {
          case 'IN':
            newQuantity =
              product.stock.currentQuantity + updateStockDto.quantity;
            break;
          case 'OUT':
            if (product.stock.currentQuantity < updateStockDto.quantity) {
              throw new BadRequestException(
                'Quantidade insuficiente para remoção',
              );
            }
            newQuantity =
              product.stock.currentQuantity - updateStockDto.quantity;
            break;
          default:
            throw new BadRequestException('Tipo de movimentação inválido');
        }

        const stock = await trx.stock.update({
          where: { productId: id },
          data: {
            currentQuantity: newQuantity,
          },
        });

        const stockMovement = await trx.stockMovement.create({
          data: {
            productId: id,
            stockId: stock.id,
            quantity: updateStockDto.quantity,
            movementType: updateStockDto.type,
          },
        });

        return {
          id,
          updateStockDto,
          user,
          product,
          stockMovement,
        };
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
