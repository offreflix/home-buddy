import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateProductStockDto {
  @IsPositive()
  @IsNumber()
  quantity: number;

  @IsEnum(['IN', 'OUT'], { message: 'Type must be either IN or OUT' })
  type: 'IN' | 'OUT';
}
