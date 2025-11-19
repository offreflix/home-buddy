import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFailedOperationsDto {
  @ApiProperty({ example: '20', required: false, default: 20 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
