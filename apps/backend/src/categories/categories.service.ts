import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const categoryAlreadyExists = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (categoryAlreadyExists) {
      throw new UnprocessableEntityException('Categoria já existe');
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });

    return category;
  }

  findAll() {
    const categories = this.prisma.category.findMany();

    return categories;
  }

  async findOne(id: number, user: UserEntity) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException();
    }

    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
