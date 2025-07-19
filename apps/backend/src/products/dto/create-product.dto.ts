import { Unit } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Arroz 5kg' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'Arroz tipo 1' , required: false})
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.trim())
  description?: string;

  @ApiProperty({ enum: Unit, example: Unit.kg })
  @IsNotEmpty()
  @IsEnum(Unit)
  unit: Unit;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsInt()
  desiredQuantity: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsInt()
  currentQuantity: number = 0;
}
