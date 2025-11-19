import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ExportProductsDto {
  @ApiPropertyOptional({
    description: 'Formato do arquivo de exportação',
    example: 'csv',
    enum: ['csv', 'json'],
  })
  @IsOptional()
  @IsString()
  format?: string = 'csv';

  @ApiPropertyOptional({
    description: 'Incluir apenas produtos com baixo estoque',
    example: false,
  })
  @IsOptional()
  lowStock?: boolean;
}
