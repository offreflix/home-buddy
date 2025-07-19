import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetStockMovementsDto {
  @ApiProperty({ example: '2024-01-01' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2024-01-31' })
  @IsDateString()
  endDate: string;
}
