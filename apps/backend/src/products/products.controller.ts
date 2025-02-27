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
import { UpdateStockDto } from 'src/stocks/dto/update-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';

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

  @Get('id/:id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.productsService.findOne(+id, user);
  }

  @Get('count')
  count(@User() user: UserEntity): Promise<{ count: number }> {
    return this.productsService.count(user);
  }

  @Get('low-stock')
  lowStock(@User() user: UserEntity) {
    return this.productsService.lowStock(user);
  }

  @Get('most-consumed')
  mostConsumed(@User() user: UserEntity) {
    return this.productsService.mostConsumed(user);
  }

  @Patch('id/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: UserEntity,
  ) {
    return this.productsService.update(+id, updateProductDto, user);
  }

  @Patch('/update-stock/:id')
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateProductStockDto,
    @User() user: UserEntity,
  ) {
    return this.productsService.updateStock(+id, updateStockDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
