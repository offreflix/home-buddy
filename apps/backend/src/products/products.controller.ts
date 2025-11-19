import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MostConsumedResult, ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { MostConsumedDto } from './dto/most-consumed.dto';
import { GetStockMovementsDto } from './dto/get-stock-movements.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import { InternalGuard } from 'src/auth/internal.guard';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';
import { Request } from 'express';
import { ProductWithRelations } from 'src/common/types/prisma.types';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto, @User() user: UserEntity) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @User() user: UserEntity,
    @Req() req: Request,
  ): Promise<PaginatedResponseDto<ProductWithRelations>> {
    return this.productsService.findAll(user, query, req);
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
  async mostConsumed(
    @Query() query: MostConsumedDto,
    @User() user: UserEntity,
  ): Promise<MostConsumedResult | []> {
    return this.productsService.mostConsumed(query, user);
  }

  @Get('count-by-category')
  async getProductsCountByCategory(@User() user: UserEntity) {
    return this.productsService.countByCategory(user);
  }

  @Get('movements')
  async getMovements(
    @Query() dto: GetStockMovementsDto,
    @User() user: UserEntity,
  ) {
    return this.productsService.getMovementsByDate(dto, user);
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

  @Public()
  @UseGuards(InternalGuard)
  @Get('internal/:userId')
  findAllInternal(@Param('userId') userId: string) {
    return this.productsService.findAllByUserId(+userId);
  }
}
