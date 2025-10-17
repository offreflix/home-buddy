import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from 'src/users/user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/auth.guard';
import { PatGuard } from 'src/auth/pat.guard';
import { RequirePermissions } from 'src/auth/permissions.decorator';
import {
  PaginationQueryDto,
  PaginatedResponseDto,
} from 'src/common/dto/pagination.dto';
import { Request } from 'express';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Post('create-many')
  async createMany(@Body() createCategoryDto: CreateCategoryDto[]) {
    return this.categoriesService.createMany(createCategoryDto);
  }

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
    @Req() req: Request,
  ): Promise<PaginatedResponseDto<any>> {
    return this.categoriesService.findAll(query, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserEntity) {
    return this.categoriesService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }

  @Public()
  @UseGuards(PatGuard)
  @RequirePermissions('read:categories')
  @Get('mcp')
  findAllForMcp(@Req() req: Request) {
    // Para categorias, retornamos todas (são globais)
    return this.categoriesService.findAll({} as PaginationQueryDto, req);
  }
}
