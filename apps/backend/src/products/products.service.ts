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
import { UpdateStockDto } from 'src/stocks/dto/update-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: UserEntity) {
    console.log(createProductDto);
    try {
      return await this.prisma.$transaction(async (trx) => {
        const categoryExists = await trx.category.findFirst({
          where: { id: createProductDto.categoryId },
        });

        if (!categoryExists) {
          throw new UnprocessableEntityException('Categoria não encontrada.');
        }

        const productExists = await this.prisma.product.findFirst({
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
          console.log(error);
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

    console.log(user);

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

  async mostConsumed(user: UserEntity) {
    const products = await this.prisma.product.findMany({
      where: {
        userId: user.id,
      },
      include: { category: true, stock: true, movements: true },
    });

    const sortedProducts = products.sort((a, b) => {
      const aTotalConsumed = a.movements.reduce(
        (total, movement) => total + movement.quantity,
        0,
      );
      const bTotalConsumed = b.movements.reduce(
        (total, movement) => total + movement.quantity,
        0,
      );
      return bTotalConsumed - aTotalConsumed;
    });

    return sortedProducts;
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
        const product = await this.prisma.product.findUnique({
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

        const stock = await this.prisma.stock.update({
          where: { productId: id },
          data: {
            currentQuantity: newQuantity,
          },
        });

        const stockMovement = await this.prisma.stockMovement.create({
          data: {
            productId: id,
            stockId: stock.id,
            quantity: updateStockDto.quantity,
            movementType: updateStockDto.type,
          },
        });

        console.log(id, updateStockDto, user, product);

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
