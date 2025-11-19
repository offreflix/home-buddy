import { Test, TestingModule } from '@nestjs/testing';
import { ScrappingController } from './scrapping.controller';
import { ScrappingService, ScrapedResponse } from './scrapping.service';
import { ScrapingQueueService } from './scrapping-queue.service';
import { Queue, Job } from 'bull';
import { ScrapingJobData } from './scrapping-queue.processor';

describe('ScrappingController', () => {
  let controller: ScrappingController;
  let scrappingService: ScrappingService;
  let scrapingQueueService: ScrapingQueueService;

  beforeEach(async () => {
    const mockScrappingService = {
      scrapeNFC: jest.fn(),
    };

    const mockScrapingQueueService = {
      addScrapingJob: jest.fn(),
      addMultipleScrapingJobs: jest.fn(),
      getJobStatus: jest.fn(),
      getQueueStats: jest.fn(),
      cleanQueue: jest.fn(),
      pauseQueue: jest.fn(),
      resumeQueue: jest.fn(),
    };

    const mockQueue = {} as Queue;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrappingController],
      providers: [
        { provide: ScrappingService, useValue: mockScrappingService },
        { provide: ScrapingQueueService, useValue: mockScrapingQueueService },
        { provide: 'BullQueue_scraping', useValue: mockQueue },
      ],
    }).compile();

    controller = module.get<ScrappingController>(ScrappingController);
    scrappingService = module.get(ScrappingService);
    scrapingQueueService = module.get(ScrapingQueueService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getScrapedData', () => {
    it('deve chamar scrappingService.scrapeNFC', async () => {
      const url = 'https://example.com';
      const mockResult: ScrapedResponse = {
        supermarketName: 'Supermercado',
        total: '100.00',
        key: 'key123',
        date: '2024-01-01',
        products: [],
      };

      jest.spyOn(scrappingService, 'scrapeNFC').mockResolvedValue(mockResult);

      const result = await controller.getScrapedData(url);

      expect(result).toEqual(mockResult);
      expect(scrappingService.scrapeNFC).toHaveBeenCalledWith(url);
    });
  });

  describe('addToQueue', () => {
    it('deve adicionar job à fila', async () => {
      const dto = { url: 'https://example.com', userId: 1 };
      const mockJob = {
        id: 'job-123',
        data: { url: dto.url, userId: dto.userId },
        opts: {},
        attemptsMade: 0,
        queue: {} as Queue,
      } as unknown as Job<ScrapingJobData>;

      jest.spyOn(scrapingQueueService, 'addScrapingJob').mockResolvedValue(mockJob);

      const result = await controller.addToQueue(dto);

      expect(result).toHaveProperty('jobId');
      expect(result).toHaveProperty('status', 'queued');
      expect(scrapingQueueService.addScrapingJob).toHaveBeenCalled();
    });
  });

  describe('getJobStatus', () => {
    it('deve retornar status do job', async () => {
      const jobId = 'job-123';
      const mockStatus = { jobId, status: 'completed' };

      type JobStatus = { jobId: string; status: string };
      jest.spyOn(scrapingQueueService, 'getJobStatus').mockResolvedValue(mockStatus as JobStatus);

      const result = await controller.getJobStatus(jobId);

      expect(result).toEqual(mockStatus);
      expect(scrapingQueueService.getJobStatus).toHaveBeenCalledWith(jobId);
    });
  });
});
