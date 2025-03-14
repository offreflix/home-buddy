import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateStockDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsPositive()
  @IsNumber()
  currentQuantity: number;

  @IsEnum(['IN', 'OUT'], { message: 'Type must be either IN or OUT' })
  type: 'IN' | 'OUT';
}
