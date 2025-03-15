import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class CreateStockDto {
  @IsInt()
  @IsPositive()
  productId: number;

  @IsPositive()
  @IsNumber()
  desiredQuantity: number;

  @IsNumber()
  currentQuantity: number;
}
