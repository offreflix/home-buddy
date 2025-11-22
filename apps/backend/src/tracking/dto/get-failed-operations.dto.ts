import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFailedOperationsDto {
  @ApiProperty({ example: '20', required: false, default: 20 })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
