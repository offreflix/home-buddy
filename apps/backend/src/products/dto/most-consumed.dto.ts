import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MostConsumedDto {
  @ApiProperty({ minimum: 1, maximum: 12, example: 5 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ minimum: 1900, maximum: 2100, example: 2024 })
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1900)
  @Max(2100)
  year: number;
}
