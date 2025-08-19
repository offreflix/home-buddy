import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OperationType, OperationStatus, Prisma } from '@prisma/client';

export interface CreateOperationLogData {
  jobId: string;
  userId?: number;
  operationType: OperationType;
  metadata?: any;
}

export interface CreateScrapingLogData {
  operationId: number;
  url: string;
  inputData: any;
  outputData?: any;
  httpStatus?: number;
  responseTime?: number;
  errorDetails?: any;
}

export interface CreateMatchingLogData {
  operationId: number;
  inputProducts: any;
  matcherRequest: any;
  matcherResponse?: any;
  matchCount?: number;
  unmatchCount?: number;
  responseTime?: number;
  errorDetails?: any;
}

export interface CreateLLMLogData {
  operationId: number;
  provider?: string;
  model: string;
  prompt: string;
  response?: string;
  promptTokens?: number;
  responseTokens?: number;
  totalTokens?: number;
  cost?: number;
  temperature?: number;
  responseTime?: number;
  errorDetails?: any;
}

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createOperationLog(data: CreateOperationLogData) {
    try {
      const operationLog = await this.prisma.operationLog.create({
        data: {
          jobId: data.jobId,
          userId: data.userId,
          operationType: data.operationType,
          metadata: data.metadata || {},
        },
      });

      this.logger.log(
        `OperationLog criado: ID ${operationLog.id}, JobID ${data.jobId}`,
      );
      return operationLog;
    } catch (error) {
      this.logger.error('Erro ao criar OperationLog:', error);
      throw error;
    }
  }

  async updateOperationStatus(
    jobId: string,
    status: OperationStatus,
    errorMessage?: string,
  ) {
    try {
      const endTime =
        status === OperationStatus.COMPLETED ||
        status === OperationStatus.FAILED
          ? new Date()
          : undefined;

      const operationLog = await this.prisma.operationLog.findUnique({
        where: { jobId },
      });

      if (!operationLog) {
        this.logger.warn(`OperationLog não encontrado para JobID: ${jobId}`);
        return null;
      }

      const duration = endTime
        ? endTime.getTime() - operationLog.startTime.getTime()
        : undefined;

      const updated = await this.prisma.operationLog.update({
        where: { jobId },
        data: {
          status,
          endTime,
          duration,
          errorMessage,
        },
      });

      this.logger.log(
        `OperationLog atualizado: JobID ${jobId}, Status ${status}`,
      );
      return updated;
    } catch (error) {
      this.logger.error(`Erro ao atualizar OperationLog ${jobId}:`, error);
      throw error;
    }
  }

  async createScrapingLog(data: CreateScrapingLogData) {
    try {
      const scrapingLog = await this.prisma.scrapingLog.create({
        data: {
          operationId: data.operationId,
          url: data.url,
          inputData: data.inputData || {},
          outputData: data.outputData || {},
          httpStatus: data.httpStatus,
          responseTime: data.responseTime,
          errorDetails: data.errorDetails || {},
        },
      });

      this.logger.log(
        `ScrapingLog criado: ID ${scrapingLog.id}, URL ${data.url}`,
      );
      return scrapingLog;
    } catch (error) {
      this.logger.error('Erro ao criar ScrapingLog:', error);
      throw error;
    }
  }

  async createMatchingLog(data: CreateMatchingLogData) {
    try {
      const matchingLog = await this.prisma.matchingLog.create({
        data: {
          operationId: data.operationId,
          inputProducts: data.inputProducts || {},
          matcherRequest: data.matcherRequest || {},
          matcherResponse: data.matcherResponse || {},
          matchCount: data.matchCount,
          unmatchCount: data.unmatchCount,
          responseTime: data.responseTime,
          errorDetails: data.errorDetails || {},
        },
      });

      this.logger.log(
        `MatchingLog criado: ID ${matchingLog.id}, Matches ${data.matchCount}, Unmatches ${data.unmatchCount}`,
      );
      return matchingLog;
    } catch (error) {
      this.logger.error('Erro ao criar MatchingLog:', error);
      throw error;
    }
  }

  async createLLMLog(data: CreateLLMLogData) {
    try {
      const llmLog = await this.prisma.lLMLog.create({
        data: {
          operationId: data.operationId,
          provider: data.provider || 'openai',
          model: data.model,
          prompt: data.prompt,
          response: data.response,
          promptTokens: data.promptTokens,
          responseTokens: data.responseTokens,
          totalTokens: data.totalTokens,
          cost: data.cost,
          temperature: data.temperature,
          responseTime: data.responseTime,
          errorDetails: data.errorDetails || {},
        },
      });

      this.logger.log(
        `LLMLog criado: ID ${llmLog.id}, Model ${data.model}, Tokens ${data.totalTokens}`,
      );
      return llmLog;
    } catch (error) {
      this.logger.error('Erro ao criar LLMLog:', error);
      throw error;
    }
  }

  async getOperationLogs(filters: {
    userId?: number;
    operationType?: OperationType;
    status?: OperationStatus;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }) {
    try {
      const where: Prisma.OperationLogWhereInput = {};

      if (filters.userId) where.userId = filters.userId;
      if (filters.operationType) where.operationType = filters.operationType;
      if (filters.status) where.status = filters.status;
      if (filters.startDate || filters.endDate) {
        where.startTime = {};
        if (filters.startDate) where.startTime.gte = filters.startDate;
        if (filters.endDate) where.startTime.lte = filters.endDate;
      }

      const operationLogs = await this.prisma.operationLog.findMany({
        where,
        include: {
          scrapingLog: true,
          matchingLog: true,
          llmLogs: true,
          user: {
            select: { id: true, username: true, email: true },
          },
        },
        orderBy: { startTime: 'desc' },
        take: filters.limit || 50,
        skip: filters.offset || 0,
      });

      return operationLogs;
    } catch (error) {
      this.logger.error('Erro ao buscar OperationLogs:', error);
      throw error;
    }
  }

  async getOperationLogByJobId(jobId: string) {
    try {
      const operationLog = await this.prisma.operationLog.findUnique({
        where: { jobId },
        include: {
          scrapingLog: true,
          matchingLog: true,
          llmLogs: true,
          user: {
            select: { id: true, username: true, email: true },
          },
        },
      });

      return operationLog;
    } catch (error) {
      this.logger.error(`Erro ao buscar OperationLog ${jobId}:`, error);
      throw error;
    }
  }

  async getOperationStats(userId?: number, days: number = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const where: Prisma.OperationLogWhereInput = {
        startTime: { gte: startDate },
      };

      if (userId) where.userId = userId;

      const stats = await this.prisma.operationLog.groupBy({
        by: ['status', 'operationType'],
        where,
        _count: { id: true },
        _avg: { duration: true },
      });

      const llmCosts = await this.prisma.lLMLog.aggregate({
        where: {
          operation: {
            startTime: { gte: startDate },
            ...(userId && { userId }),
          },
        },
        _sum: { cost: true, totalTokens: true },
        _count: { id: true },
      });

      return {
        operations: stats,
        llmCosts: {
          totalCost: llmCosts._sum.cost || 0,
          totalTokens: llmCosts._sum.totalTokens || 0,
          totalRequests: llmCosts._count || 0,
        },
      };
    } catch (error) {
      this.logger.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}
