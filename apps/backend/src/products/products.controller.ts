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
import { PatGuard } from 'src/auth/pat.guard';
import { RequirePermissions } from 'src/auth/permissions.decorator';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';
import { Request } from 'express';

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
  ): Promise<PaginatedResponseDto<any>> {
    return this.productsService.findAll(user, query, req);
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

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.productsService.findOne(productId, user);
  }

  @Patch('id/:id')
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: UserEntity,
  ) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.productsService.update(productId, updateProductDto, user);
  }

  @Patch('/update-stock/:id')
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateProductStockDto,
    @User() user: UserEntity,
  ) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.productsService.updateStock(productId, updateStockDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new Error(`ID inválido: ${id}`);
    }
    return this.productsService.remove(productId);
  }

  @Public()
  @UseGuards(InternalGuard)
  @Get('internal/:userId')
  findAllInternal(@Param('userId') userId: string) {
    return this.productsService.findAllByUserId(+userId);
  }

  @Public()
  @UseGuards(PatGuard)
  @RequirePermissions('read:products')
  @Get('mcp')
  findAllForMcp(@Req() req: any) {
    // Usar PAT do usuário
    return this.productsService.findAllByUserId(req.user.id);
  }

  @Public()
  @UseGuards(PatGuard)
  @RequirePermissions('read:products')
  @Get('mcp/:id')
  findOneForMcp(@Param('id') id: string, @Req() req: any) {
    // Usar PAT do usuário
    console.log('findOneForMcp - id recebido:', id, 'tipo:', typeof id);

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new Error(`ID inválido: ${id}`);
    }

    console.log(
      'findOneForMcp - id convertido:',
      productId,
      'tipo:',
      typeof productId,
    );
    console.log('findOneForMcp - req.user:', req.user);

    const user = new UserEntity(req.user.id, 'mcp-user');
    return this.productsService.findOne(productId, user);
  }
}
