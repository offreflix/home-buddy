import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MatchStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class UpdateMatchStatusDto {
  @ApiProperty({ description: 'Título do produto no scraping' })
  @IsString()
  scrapTitle: string;

  @ApiProperty({ enum: MatchStatus, description: 'Novo status do match' })
  @IsEnum(MatchStatus)
  status: MatchStatus;

  @ApiProperty({
    description: 'ID do produto vinculado (se aceito)',
    required: false,
  })
  @IsOptional()
  @IsString()
  productId?: string;
}
