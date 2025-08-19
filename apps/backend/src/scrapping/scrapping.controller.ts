import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Inject,
  Param,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ScrapedResponse, ScrappingService } from './scrapping.service';
import { Public } from 'src/auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ScrapingJobData } from './scrapping-queue.processor';
import {
  AddToQueueDto,
  AddMultipleToQueueDto,
  JobStatusResponseDto,
} from './dto/scraping-queue.dto';
import { ScrapingQueueService } from './scrapping-queue.service';

@ApiTags('scrapping')
@Controller('scrapping')
export class ScrappingController {
  constructor(
    private readonly scrappingService: ScrappingService,
    private readonly scrapingQueueService: ScrapingQueueService,
    @InjectQueue('scraping') private readonly scrapingQueue: Queue,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Scraping síncrono - processa imediatamente' })
  @ApiResponse({ status: 200, description: 'Dados extraídos com sucesso' })
  async getScrapedData(@Query('url') url: string): Promise<ScrapedResponse> {
    return this.scrappingService.scrapeNFC(url);
  }

  @Post('queue')
  @ApiOperation({
    summary: 'Adiciona scraping à fila para processamento assíncrono',
  })
  @ApiResponse({
    status: 201,
    description: 'Job adicionado à fila com sucesso',
  })
  async addToQueue(@Body() data: AddToQueueDto) {
    const job = await this.scrapingQueueService.addScrapingJob({
      url: data.url,
      userId: data.userId,
    });

    return {
      message: 'Job adicionado à fila com sucesso',
      jobId: job.id,
      status: 'queued',
    };
  }

  @Post('queue/multiple')
  @ApiOperation({ summary: 'Adiciona múltiplos scrapings à fila' })
  @ApiResponse({
    status: 201,
    description: 'Jobs adicionados à fila com sucesso',
  })
  async addMultipleToQueue(@Body() data: AddMultipleToQueueDto) {
    const job = await this.scrapingQueueService.addMultipleScrapingJobs(
      data.urls,
      data.userId,
    );

    return {
      message: 'Jobs adicionados à fila com sucesso',
      jobId: job.id,
      status: 'queued',
      totalUrls: data.urls.length,
    };
  }

  @Get('queue/status/:jobId')
  @ApiOperation({ summary: 'Verifica o status de um job na fila' })
  @ApiResponse({
    status: 200,
    description: 'Status do job',
    type: JobStatusResponseDto,
  })
  async getJobStatus(
    @Param('jobId') jobId: string,
  ): Promise<JobStatusResponseDto | { error: string }> {
    return this.scrapingQueueService.getJobStatus(jobId);
  }

  @Get('queue/stats')
  @ApiOperation({ summary: 'Obtém estatísticas da fila de scraping' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas da fila',
  })
  async getQueueStats() {
    return this.scrapingQueueService.getQueueStats();
  }

  @Post('queue/clean')
  @ApiOperation({ summary: 'Limpa jobs completados e falhados da fila' })
  @ApiResponse({
    status: 200,
    description: 'Fila limpa com sucesso',
  })
  async cleanQueue() {
    await this.scrapingQueueService.cleanQueue();
    return { message: 'Fila limpa com sucesso' };
  }

  @Post('queue/pause')
  @ApiOperation({ summary: 'Pausa a fila de scraping' })
  @ApiResponse({
    status: 200,
    description: 'Fila pausada com sucesso',
  })
  async pauseQueue() {
    await this.scrapingQueueService.pauseQueue();
    return { message: 'Fila pausada com sucesso' };
  }

  @Post('queue/resume')
  @ApiOperation({ summary: 'Retoma a fila de scraping' })
  @ApiResponse({
    status: 200,
    description: 'Fila retomada com sucesso',
  })
  async resumeQueue() {
    await this.scrapingQueueService.resumeQueue();
    return { message: 'Fila retomada com sucesso' };
  }
}
