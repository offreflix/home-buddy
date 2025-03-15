import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class MostConsumedDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;
}
