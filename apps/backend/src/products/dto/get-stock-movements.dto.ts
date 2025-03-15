import { IsDateString } from 'class-validator';

export class GetStockMovementsDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
