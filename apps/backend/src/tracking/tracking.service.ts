import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { OperationType, OperationStatus, Prisma } from '@prisma/client';
import {
  OperationMetadataJson,
  ScrapingInputDataJson,
  ScrapingOutputDataJson,
  MatchingInputProductsJson,
  MatchingRequestJson,
  MatchingResponseJson,
  ErrorDetailsJson,
  LLMErrorDetailsJson,
} from './types/tracking.types';

export interface CreateOperationLogData {
  jobId: string;
  userId?: number;
  operationType: OperationType;
  metadata?: OperationMetadataJson;
}

export interface CreateScrapingLogData {
  operationId: number;
  url: string;
  inputData: ScrapingInputDataJson;
  outputData?: ScrapingOutputDataJson;
  httpStatus?: number;
  responseTime?: number;
  errorDetails?: ErrorDetailsJson;
}

export interface CreateMatchingLogData {
  operationId: number;
  inputProducts: MatchingInputProductsJson;
  matcherRequest: MatchingRequestJson;
  matcherResponse?: MatchingResponseJson;
  matchCount?: number;
  unmatchCount?: number;
  responseTime?: number;
  errorDetails?: ErrorDetailsJson;
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
  errorDetails?: LLMErrorDetailsJson;
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

  async updateMatchStatus(
    jobId: string,
    scrapTitle: string,
    status: 'ACCEPTED' | 'REJECTED',
    productId?: string,
  ) {
    try {
      const operationLog = await this.prisma.operationLog.findUnique({
        where: { jobId },
        include: { matchingLog: true },
      });

      if (!operationLog || !operationLog.matchingLog) {
        throw new Error('MatchingLog não encontrado para este JobID');
      }

      const matchingLog = operationLog.matchingLog;
      const matcherResponse = matchingLog.matcherResponse as any; // Cast to any to manipulate JSON

      if (!matcherResponse) {
        throw new Error('MatcherResponse vazio');
      }

      // Helper to update item in list
      const updateList = (list: any[]) => {
        if (!list) return false;
        const index = list.findIndex(
          (item) =>
            item.scrap_title === scrapTitle || item.title === scrapTitle,
        );
        if (index !== -1) {
          list[index] = {
            ...list[index],
            status,
            ...(productId && { product_id: productId }),
          };
          return true;
        }
        return false;
      };

      // Try to find and update in 'match' list
      let updated = updateList(matcherResponse.match);

      // If not found, try 'unmatch' list
      if (!updated) {
        updated = updateList(matcherResponse.unmatch);
      }

      if (!updated) {
        this.logger.warn(
          `Item '${scrapTitle}' não encontrado no MatchingLog do Job ${jobId}`,
        );
        // Optional: Add to a new list or throw error? For now, just warn.
        return null;
      }

      // Update database
      await this.prisma.matchingLog.update({
        where: { id: matchingLog.id },
        data: {
          matcherResponse: matcherResponse as Prisma.JsonValue,
        },
      });

      this.logger.log(
        `Match status atualizado para '${scrapTitle}' no Job ${jobId}: ${status}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar match status para Job ${jobId}:`,
        error,
      );
      throw error;
    }
  }
}
