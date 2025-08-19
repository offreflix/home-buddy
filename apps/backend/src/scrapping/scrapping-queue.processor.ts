import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { ScrappingService, ScrapedResponse } from './scrapping.service';
import { MatcherService } from './matcher.service';
import { MatchResultDto } from './dto/match-result.dto';
import { TrackingService } from '../tracking/tracking.service';
import { OperationType, OperationStatus } from '@prisma/client';

export interface ScrapingJobData {
  url: string;
  userId?: number;
}

export interface ScrapingJobResult {
  success: boolean;
  data?: ScrapedResponse;
  matchResult?: MatchResultDto;
  error?: string;
}

@Injectable()
@Processor('scraping')
export class ScrapingQueueProcessor {
  private readonly logger = new Logger(ScrapingQueueProcessor.name);

  constructor(
    private readonly scrappingService: ScrappingService,
    private readonly matcherService: MatcherService,
    private readonly trackingService: TrackingService,
  ) {}

  @Process('scrape-nfc')
  async handleScraping(job: Job<ScrapingJobData>): Promise<ScrapingJobResult> {
    const jobId = job.id.toString();
    const startTime = Date.now();

    this.logger.log(
      `Iniciando scraping para URL: ${job.data.url} (Job ID: ${jobId})`,
    );

    const operationType =
      job.data.userId && job.data.userId > 0
        ? OperationType.SCRAPING_MATCHING
        : OperationType.SCRAPING_ONLY;

    let operationLog;
    try {
      this.logger.log(
        `Criando OperationLog para Job ${jobId}, userId: ${job.data.userId}`,
      );
      operationLog = await this.trackingService.createOperationLog({
        jobId,
        userId: job.data.userId,
        operationType,
        metadata: { url: job.data.url },
      });
      this.logger.log(`OperationLog criado com sucesso: ID ${operationLog.id}`);
    } catch (trackingError) {
      this.logger.error(
        'Erro ao criar log de operação, continuando sem tracking:',
        trackingError,
      );
    }

    try {
      await job.progress(0);

      await job.progress(10);

      const scrapingStartTime = Date.now();
      const result = await this.scrappingService.scrapeNFC(job.data.url);
      const scrapingResponseTime = Date.now() - scrapingStartTime;

      if (operationLog) {
        try {
          this.logger.log(
            `Criando ScrapingLog para OperationLog ${operationLog.id}`,
          );
          await this.trackingService.createScrapingLog({
            operationId: operationLog.id,
            url: job.data.url,
            inputData: { url: job.data.url, userId: job.data.userId },
            outputData: {
              productsCount: result.products.length,
              products: result.products,
            },
            httpStatus: 200,
            responseTime: scrapingResponseTime,
          });
          this.logger.log(
            `ScrapingLog criado com sucesso para OperationLog ${operationLog.id}`,
          );
        } catch (trackingError) {
          this.logger.error('Erro ao salvar log de scraping:', trackingError);
        }
      } else {
        this.logger.warn('OperationLog não existe, pulando ScrapingLog');
      }

      await job.progress(50);

      let matchResult: MatchResultDto | undefined;

      if (job.data.userId && result.products.length > 0) {
        try {
          this.logger.log(
            `Iniciando matching para usuário ${job.data.userId} com ${result.products.length} produtos`,
          );

          await job.progress(60);

          const matchingStartTime = Date.now();
          matchResult = await this.matcherService.matchProducts(
            job.data.userId,
            result.products,
            operationLog?.id,
          );
          const matchingResponseTime = Date.now() - matchingStartTime;

          this.logger.log(
            `Matching concluído: ${matchResult.match.length} matches, ${matchResult.unmatch.length} unmatches`,
          );

          if (operationLog) {
            try {
              this.logger.log(
                `Criando MatchingLog para OperationLog ${operationLog.id}`,
              );
              await this.trackingService.createMatchingLog({
                operationId: operationLog.id,
                inputProducts: result.products,
                matcherRequest: {
                  user_id: job.data.userId.toString(),
                  products_scrap: result.products,
                },
                matcherResponse: matchResult,
                matchCount: matchResult.match.length,
                unmatchCount: matchResult.unmatch.length,
                responseTime: matchingResponseTime,
              });
              this.logger.log(
                `MatchingLog criado com sucesso para OperationLog ${operationLog.id}`,
              );
            } catch (trackingError) {
              this.logger.error(
                'Erro ao salvar log de matching:',
                trackingError,
              );
            }
          } else {
            this.logger.warn('OperationLog não existe, pulando MatchingLog');
          }

          await job.progress(80);
        } catch (error) {
          this.logger.error(`Erro no matching, continuando sem ele:`, error);

          if (operationLog) {
            try {
              await this.trackingService.createMatchingLog({
                operationId: operationLog.id,
                inputProducts: result.products,
                matcherRequest: {
                  user_id: job.data.userId.toString(),
                  products_scrap: result.products,
                },
                errorDetails: {
                  message:
                    error instanceof Error
                      ? error.message
                      : 'Erro desconhecido',
                  stack: error instanceof Error ? error.stack : undefined,
                },
              });
            } catch (trackingError) {
              this.logger.warn(
                'Erro ao salvar log de matching com erro:',
                trackingError,
              );
            }
          }

          await job.progress(80);
        }
      } else {
        this.logger.warn(
          `Matching não executado - userId: ${job.data.userId}, produtos: ${result.products.length}`,
        );
        await job.progress(80);
      }

      await job.progress(90);
      await job.progress(100);

      if (operationLog) {
        try {
          await this.trackingService.updateOperationStatus(
            jobId,
            OperationStatus.COMPLETED,
          );
        } catch (trackingError) {
          this.logger.warn(
            'Erro ao atualizar status da operação:',
            trackingError,
          );
        }
      }

      this.logger.log(
        `Scraping${matchResult ? ' e matching' : ''} concluído com sucesso para URL: ${job.data.url}`,
      );

      return {
        success: true,
        data: result,
        matchResult,
      };
    } catch (error) {
      this.logger.error(`Erro no scraping para URL ${job.data.url}:`, error);

      if (operationLog) {
        try {
          await this.trackingService.updateOperationStatus(
            jobId,
            OperationStatus.FAILED,
            error instanceof Error ? error.message : 'Erro desconhecido',
          );
        } catch (trackingError) {
          this.logger.warn(
            'Erro ao atualizar status da operação para FAILED:',
            trackingError,
          );
        }
      }

      await job.progress(0);

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  @Process('scrape-multiple')
  async handleMultipleScraping(
    job: Job<{ urls: string[]; userId?: string }>,
  ): Promise<ScrapingJobResult[]> {
    this.logger.log(
      `Iniciando scraping múltiplo para ${job.data.urls.length} URLs`,
    );

    const results: ScrapingJobResult[] = [];

    for (const url of job.data.urls) {
      try {
        const result = await this.scrappingService.scrapeNFC(url);
        results.push({
          success: true,
          data: result,
        });
      } catch (error) {
        this.logger.error(`Erro no scraping para URL ${url}:`, error);
        results.push({
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }

    this.logger.log(
      `Scraping múltiplo concluído. ${results.filter((r) => r.success).length}/${results.length} sucessos`,
    );

    return results;
  }
}
