import { Test, TestingModule } from '@nestjs/testing';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { createMockUserEntity } from 'src/common/test-helpers/mock-factories';
import { AuthRequest } from 'src/auth/auth.controller';
import { OperationLog, OperationType, OperationStatus, Prisma, ScrapingLog, MatchingLog, LLMLog } from '@prisma/client';
import { OperationStatsResponseDto } from './dto/operation-response.dto';

describe('TrackingController', () => {
  let controller: TrackingController;
  let service: TrackingService;

  const mockUser = createMockUserEntity({ id: 1 });

  beforeEach(async () => {
    const mockService = {
      getOperationLogs: jest.fn(),
      getOperationLogByJobId: jest.fn(),
      getOperationStats: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingController],
      providers: [
        {
          provide: TrackingService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TrackingController>(TrackingController);
    service = module.get<TrackingService>(TrackingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOperationLogs', () => {
    it('deve retornar logs de operações', async () => {
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const query = {};
      const mockLogs: Awaited<ReturnType<typeof service.getOperationLogs>> = [
        {
          id: 1,
          jobId: 'job-123',
          userId: mockUser.id,
          operationType: OperationType.SCRAPING_ONLY,
          status: OperationStatus.COMPLETED,
          startTime: new Date(),
          endTime: new Date(),
          duration: 1000,
          errorMessage: null as string | null,
          metadata: {},
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: mockUser.id, username: mockUser.username, email: 'test@example.com' },
          scrapingLog: null as ScrapingLog | null,
          matchingLog: null as MatchingLog | null,
          llmLogs: [] as LLMLog[],
        },
      ];

      jest.spyOn(service, 'getOperationLogs').mockResolvedValue(mockLogs);

      const result = await controller.getOperationLogs(mockRequest, query);

      expect(result).toEqual(mockLogs);
      expect(service.getOperationLogs).toHaveBeenCalled();
    });
  });

  describe('getOperationByJobId', () => {
    it('deve retornar operação por jobId', async () => {
      const jobId = 'job-123';
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const mockOperation: Awaited<ReturnType<typeof service.getOperationLogByJobId>> = {
        id: 1,
        jobId,
        userId: mockUser.id,
        operationType: OperationType.SCRAPING_ONLY,
        status: OperationStatus.COMPLETED,
        startTime: new Date(),
        endTime: new Date(),
        duration: 1000,
        errorMessage: null as string | null,
        metadata: {} as Prisma.JsonValue,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: mockUser.id, username: mockUser.username, email: 'test@example.com' },
        scrapingLog: null as ScrapingLog | null,
        matchingLog: null as MatchingLog | null,
        llmLogs: [] as LLMLog[],
      };

      jest.spyOn(service, 'getOperationLogByJobId').mockResolvedValue(mockOperation);

      const result = await controller.getOperationByJobId(jobId, mockRequest);

      expect(result).toEqual(mockOperation);
      expect(service.getOperationLogByJobId).toHaveBeenCalledWith(jobId);
    });
  });

  describe('getOperationStats', () => {
    it('deve retornar estatísticas', async () => {
      const mockRequest = {
        user: mockUser,
      } as unknown as AuthRequest;

      const query = { days: 30 };
      const mockStats: Awaited<ReturnType<typeof service.getOperationStats>> = {
        operations: [
          {
            status: OperationStatus.COMPLETED,
            operationType: OperationType.SCRAPING_ONLY,
            _count: { id: 10 },
            _avg: { duration: 1000 as number | null },
          },
        ],
        llmCosts: {
          totalCost: 0,
          totalTokens: 0,
          totalRequests: 0,
        },
      };

      jest.spyOn(service, 'getOperationStats').mockResolvedValue(mockStats);

      const result = await controller.getOperationStats(mockRequest, query);

      expect(result).toEqual(mockStats);
      expect(service.getOperationStats).toHaveBeenCalledWith(mockUser.id, 30);
    });
  });
});

