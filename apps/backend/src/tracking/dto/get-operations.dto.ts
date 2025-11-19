import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumberString,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OperationType, OperationStatus } from '@prisma/client';

export class GetOperationsDto {
  @ApiProperty({ enum: OperationType, required: false })
  @IsOptional()
  @IsEnum(OperationType)
  operationType?: OperationType;

  @ApiProperty({ enum: OperationStatus, required: false })
  @IsOptional()
  @IsEnum(OperationStatus)
  status?: OperationStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00Z', required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ example: '2024-01-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: '50', required: false, default: 50 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;

  @ApiProperty({ example: '0', required: false, default: 0 })
  @IsOptional()
  @IsNumberString()
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number;

  @ApiProperty({
    example: 'false',
    required: false,
    description: 'Admin only: view all users operations',
  })
  @IsOptional()
  @IsString()
  allUsers?: string;
}
