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

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, user: UserEntity) {
    try {
      return await this.prisma.$transaction(async (trx) => {
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
      include: { category: true, stock: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return products;
  }

  findOne(id: number, user: UserEntity) {
    const product = this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException();
    }

    console.log(user);

    return product;
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

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
