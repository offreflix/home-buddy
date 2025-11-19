import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductStockDto {
  @ApiProperty({ example: 5 })
  @IsPositive()
  @IsNumber()
  quantity: number;

  @ApiProperty({ enum: ['IN','OUT'], example: 'IN' })
  @IsEnum(['IN', 'OUT'], { message: 'Type must be either IN or OUT' })
  type: 'IN' | 'OUT';
}
