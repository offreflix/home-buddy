import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import {
  ScrapingJobData,
  ScrapingJobResult,
} from './scrapping-queue.processor';

@Injectable()
export class ScrapingQueueService {
  private readonly logger = new Logger(ScrapingQueueService.name);

  constructor(@InjectQueue('scraping') private readonly scrapingQueue: Queue) {}

  async addScrapingJob(data: ScrapingJobData): Promise<Job<ScrapingJobData>> {
    this.logger.log(`Adicionando job de scraping para URL: ${data.url}`);

    const job = await this.scrapingQueue.add('scrape-nfc', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: 100,
      removeOnFail: 50,
    });

    this.logger.log(`Job ${job.id} adicionado à fila`);
    return job;
  }

  async addMultipleScrapingJobs(urls: string[], userId?: number): Promise<Job> {
    this.logger.log(
      `Adicionando job de scraping múltiplo para ${urls.length} URLs`,
    );

    const job = await this.scrapingQueue.add(
      'scrape-multiple',
      { urls, userId },
      {
        attempts: 2,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 50,
        removeOnFail: 25,
      },
    );

    this.logger.log(`Job múltiplo ${job.id} adicionado à fila`);
    return job;
  }

  async getJobStatus(jobId: string): Promise<any> {
    const job = await this.scrapingQueue.getJob(jobId);

    if (!job) {
      return { error: 'Job não encontrado' };
    }

    const state = await job.getState();
    const progress = await job.progress();
    const result = await job.returnvalue;
    const failedReason = job.failedReason;

    let message = '';
    let phase = '';

    if (state === 'waiting') {
      message = 'Aguardando na fila...';
      phase = 'queued';
    } else if (state === 'active') {
      if (progress < 10) {
        message = 'Iniciando scraping da página...';
        phase = 'scraping';
      } else if (progress < 50) {
        message = 'Extraindo dados da página...';
        phase = 'scraping';
      } else if (progress < 80) {
        message = 'Comparando produtos com IA...';
        phase = 'matching';
      } else if (progress < 100) {
        message = 'Finalizando processamento...';
        phase = 'finalizing';
      }
    } else if (state === 'completed') {
      message = 'Processamento concluído com sucesso!';
      phase = 'completed';
    } else if (state === 'failed') {
      message = failedReason || 'Erro durante o processamento';
      phase = 'failed';
    }

    return {
      jobId,
      state,
      progress,
      message,
      phase,
      result,
      matchResult: result?.matchResult,
      failedReason,
      data: job.data,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn,
    };
  }

  async getQueueStats(): Promise<any> {
    const waiting = await this.scrapingQueue.getWaiting();
    const active = await this.scrapingQueue.getActive();
    const completed = await this.scrapingQueue.getCompleted();
    const failed = await this.scrapingQueue.getFailed();

    return {
      waiting: waiting.length,
      active: active.length,
      completed: completed.length,
      failed: failed.length,
      total: waiting.length + active.length + completed.length + failed.length,
    };
  }

  async cleanQueue(): Promise<void> {
    this.logger.log('Limpando fila de scraping');
    await this.scrapingQueue.clean(0, 'completed');
    await this.scrapingQueue.clean(0, 'failed');
  }

  async pauseQueue(): Promise<void> {
    this.logger.log('Pausando fila de scraping');
    await this.scrapingQueue.pause();
  }

  async resumeQueue(): Promise<void> {
    this.logger.log('Retomando fila de scraping');
    await this.scrapingQueue.resume();
  }
}
