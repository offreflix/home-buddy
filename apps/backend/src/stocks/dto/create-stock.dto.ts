import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ example: 20 })
  @IsPositive()
  @IsNumber()
  desiredQuantity: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  currentQuantity: number;
}
