import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user: UserEntity) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@User() user: UserEntity) {
    return this.productsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.productsService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: UserEntity,
  ) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
