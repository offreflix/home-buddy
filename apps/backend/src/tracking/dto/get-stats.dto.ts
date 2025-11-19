import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetStatsDto {
  @ApiProperty({ example: '30', required: false, default: 30 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  days?: number;

  @ApiProperty({
    example: 'false',
    required: false,
    description: 'Admin only: view all users stats',
  })
  @IsOptional()
  @IsString()
  allUsers?: string;
}
