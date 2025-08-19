import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OperationStatus } from '@prisma/client';
import { TrackingService } from './tracking.service';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuthRequest } from '../auth/auth.controller';
import {
  GetOperationsDto,
  GetStatsDto,
  GetFailedOperationsDto,
  OperationLogResponseDto,
  OperationStatsResponseDto,
  LLMCostStatsDto,
} from './dto';

@ApiTags('tracking')
@Controller('tracking')
@UseGuards(JwtAuthGuard)
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Get('operations')
  @ApiOperation({ summary: 'Lista operações com filtros' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operações',
    type: [OperationLogResponseDto],
  })
  async getOperationLogs(
    @Request() req: AuthRequest,
    @Query() query: GetOperationsDto,
  ) {
    const userId = query.allUsers === 'true' ? undefined : req.user.id;

    const filters = {
      userId,
      operationType: query.operationType,
      status: query.status,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      limit: query.limit || 50,
      offset: query.offset || 0,
    };

    return await this.trackingService.getOperationLogs(filters);
  }

  @Get('operations/:jobId')
  @ApiOperation({ summary: 'Busca operação por Job ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da operação',
    type: OperationLogResponseDto,
  })
  async getOperationByJobId(
    @Param('jobId') jobId: string,
    @Request() req: AuthRequest,
  ) {
    const operation = await this.trackingService.getOperationLogByJobId(jobId);

    if (operation && operation.userId !== req.user.id) {
      return null;
    }

    return operation;
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estatísticas de operações' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas gerais',
    type: OperationStatsResponseDto,
  })
  async getOperationStats(
    @Request() req: AuthRequest,
    @Query() query: GetStatsDto,
  ) {
    const userId = query.allUsers === 'true' ? undefined : req.user.id;
    return await this.trackingService.getOperationStats(
      userId,
      query.days || 30,
    );
  }

  @Get('llm-costs')
  @ApiOperation({ summary: 'Custos da LLM' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas de custos da LLM',
    type: LLMCostStatsDto,
  })
  async getLLMCosts(@Request() req: AuthRequest, @Query() query: GetStatsDto) {
    const stats = await this.trackingService.getOperationStats(
      req.user.id,
      query.days || 30,
    );
    return stats.llmCosts;
  }

  @Get('running')
  @ApiOperation({ summary: 'Operações em execução' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operações em execução',
    type: [OperationLogResponseDto],
  })
  async getRunningOperations(@Request() req: AuthRequest) {
    return await this.trackingService.getOperationLogs({
      userId: req.user.id,
      status: OperationStatus.RUNNING,
      limit: 100,
    });
  }

  @Get('failed')
  @ApiOperation({ summary: 'Operações falhadas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operações que falharam',
    type: [OperationLogResponseDto],
  })
  async getFailedOperations(
    @Request() req: AuthRequest,
    @Query() query: GetFailedOperationsDto,
  ) {
    return await this.trackingService.getOperationLogs({
      userId: req.user.id,
      status: OperationStatus.FAILED,
      limit: query.limit || 20,
    });
  }
}
