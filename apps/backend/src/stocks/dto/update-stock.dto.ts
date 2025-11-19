import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 10 })
  @IsPositive()
  @IsNumber()
  currentQuantity: number;

  @ApiProperty({ enum: ['IN','OUT'], example: 'IN' })
  @IsEnum(['IN', 'OUT'], { message: 'Type must be either IN or OUT' })
  type: 'IN' | 'OUT';
}
