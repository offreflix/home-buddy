import { ApiProperty } from '@nestjs/swagger';
import { OperationType, OperationStatus, Prisma } from '@prisma/client';

export class UserSummaryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}

export class ScrapingLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  inputData: Prisma.JsonValue;

  @ApiProperty({ required: false })
  outputData?: Prisma.JsonValue;

  @ApiProperty({ required: false })
  httpStatus?: number;

  @ApiProperty({ required: false })
  responseTime?: number;

  @ApiProperty({ required: false })
  errorDetails?: Prisma.JsonValue;

  @ApiProperty()
  createdAt: Date;
}

export class MatchingLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  inputProducts: Prisma.JsonValue;

  @ApiProperty()
  matcherRequest: Prisma.JsonValue;

  @ApiProperty({ required: false })
  matcherResponse?: Prisma.JsonValue;

  @ApiProperty({ required: false })
  matchCount?: number;

  @ApiProperty({ required: false })
  unmatchCount?: number;

  @ApiProperty({ required: false })
  responseTime?: number;

  @ApiProperty({ required: false })
  errorDetails?: Prisma.JsonValue;

  @ApiProperty()
  createdAt: Date;
}

export class LLMLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  provider: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty({ required: false })
  response?: string;

  @ApiProperty({ required: false })
  promptTokens?: number;

  @ApiProperty({ required: false })
  responseTokens?: number;

  @ApiProperty({ required: false })
  totalTokens?: number;

  @ApiProperty({ required: false })
  temperature?: number;

  @ApiProperty({ required: false })
  responseTime?: number;

  @ApiProperty({ required: false })
  cost?: number;

  @ApiProperty({ required: false })
  errorDetails?: Prisma.JsonValue;

  @ApiProperty()
  createdAt: Date;
}

export class OperationLogResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  jobId: string;

  @ApiProperty({ required: false })
  userId?: number;

  @ApiProperty({ enum: OperationType })
  operationType: OperationType;

  @ApiProperty({ enum: OperationStatus })
  status: OperationStatus;

  @ApiProperty()
  startTime: Date;

  @ApiProperty({ required: false })
  endTime?: Date;

  @ApiProperty({ required: false })
  duration?: number;

  @ApiProperty({ required: false })
  errorMessage?: string;

  @ApiProperty({ required: false })
  metadata?: Prisma.JsonValue;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserSummaryDto, required: false })
  user?: UserSummaryDto;

  @ApiProperty({ type: ScrapingLogResponseDto, required: false })
  scrapingLog?: ScrapingLogResponseDto;

  @ApiProperty({ type: MatchingLogResponseDto, required: false })
  matchingLog?: MatchingLogResponseDto;

  @ApiProperty({ type: [LLMLogResponseDto] })
  llmLogs: LLMLogResponseDto[];
}

export class LLMCostStatsDto {
  @ApiProperty()
  totalCost: number;

  @ApiProperty()
  totalTokens: number;

  @ApiProperty()
  totalRequests: number;
}

export class OperationStatsItemDto {
  @ApiProperty({ enum: OperationStatus })
  status: OperationStatus;

  @ApiProperty({ enum: OperationType })
  operationType: OperationType;

  @ApiProperty()
  _count: { id: number };

  @ApiProperty({ required: false })
  _avg: { duration?: number };
}

export class OperationStatsResponseDto {
  @ApiProperty({ type: [OperationStatsItemDto] })
  operations: OperationStatsItemDto[];

  @ApiProperty({ type: LLMCostStatsDto })
  llmCosts: LLMCostStatsDto;
}
