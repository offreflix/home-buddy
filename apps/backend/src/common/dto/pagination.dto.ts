import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Número da página',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    default: 10,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(100)
  perPage?: number = 10;

  @ApiProperty({
    description: 'Campo para ordenação',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Direção da ordenação',
    example: 'desc',
    enum: ['asc', 'desc'],
    default: 'desc',
    required: false,
  })
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class PaginationMetaDto {
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Itens por página',
    example: 10,
  })
  perPage: number;

  @ApiProperty({
    description: 'Total de itens',
    example: 95,
  })
  total: number;

  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;

  @ApiProperty({
    description: 'Se existe próxima página',
    example: true,
  })
  hasNextPage: boolean;

  @ApiProperty({
    description: 'Se existe página anterior',
    example: false,
  })
  hasPrevPage: boolean;

  @ApiProperty({
    description: 'Item inicial da página atual',
    example: 1,
  })
  from: number;

  @ApiProperty({
    description: 'Item final da página atual',
    example: 10,
  })
  to: number;
}

export class PaginationLinksDto {
  @ApiProperty({
    description: 'URL da página atual',
    example: '/api/products?page=1&perPage=10',
  })
  self: string;

  @ApiProperty({
    description: 'URL da próxima página',
    example: '/api/products?page=2&perPage=10',
    nullable: true,
  })
  next: string | null;

  @ApiProperty({
    description: 'URL da página anterior',
    example: null,
    nullable: true,
  })
  prev: string | null;

  @ApiProperty({
    description: 'URL da primeira página',
    example: '/api/products?page=1&perPage=10',
  })
  first: string;

  @ApiProperty({
    description: 'URL da última página',
    example: '/api/products?page=10&perPage=10',
  })
  last: string;
}

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array de dados da página atual',
  })
  data: T[];

  @ApiProperty({
    description: 'Metadados da paginação',
    type: PaginationMetaDto,
  })
  meta: PaginationMetaDto;

  @ApiProperty({
    description: 'Links de navegação',
    type: PaginationLinksDto,
  })
  links: PaginationLinksDto;
}

export interface PaginationOptions {
  page: number;
  perPage: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface PaginationResult<T> {
  data: T[];
  meta: PaginationMetaDto;
  links: PaginationLinksDto;
}
