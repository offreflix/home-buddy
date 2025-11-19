import { Test, TestingModule } from '@nestjs/testing';
import { TrackingService } from './tracking.service';
import { PrismaService } from 'src/prisma.service';
import { OperationType, OperationStatus, OperationLog } from '@prisma/client';
import { createMockPrismaService } from 'src/common/test-helpers/mock-factories';

describe('TrackingService', () => {
  let service: TrackingService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrackingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TrackingService>(TrackingService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOperationLog', () => {
    it('deve criar log de operação com sucesso', async () => {
      const data = {
        jobId: 'job-123',
        userId: 1,
        operationType: OperationType.SCRAPING_ONLY,
      };

      const mockOperationLog = {
        id: 1,
        ...data,
        status: OperationStatus.RUNNING,
        createdAt: new Date(),
      };

      (prismaService.operationLog.create as jest.Mock).mockResolvedValue(mockOperationLog as OperationLog);

      const result = await service.createOperationLog(data);

      expect(result).toEqual(mockOperationLog);
      expect(prismaService.operationLog.create).toHaveBeenCalledWith({
        data: {
          jobId: data.jobId,
          userId: data.userId,
          operationType: data.operationType,
          metadata: {},
        },
      });
    });
  });

  describe('updateOperationStatus', () => {
    it('deve atualizar status da operação', async () => {
      const jobId = 'job-123';
      const status = OperationStatus.COMPLETED;
      const startTime = new Date();

      const mockOperationLog = {
        id: 1,
        jobId,
        status: OperationStatus.RUNNING,
        startTime,
        userId: 1,
        operationType: OperationType.SCRAPING_ONLY,
        createdAt: new Date(),
        updatedAt: new Date(),
        errorMessage: null as string | null,
        metadata: {},
        endTime: null as Date | null,
        duration: null as number | null,
      };

      (prismaService.operationLog.findUnique as jest.Mock).mockResolvedValue(mockOperationLog as OperationLog);
      (prismaService.operationLog.update as jest.Mock).mockResolvedValue({
        ...mockOperationLog,
        status,
        endTime: new Date(),
        duration: 1000,
      } as OperationLog);

      const result = await service.updateOperationStatus(jobId, status);

      expect(result.status).toBe(status);
      expect(prismaService.operationLog.update).toHaveBeenCalled();
    });
  });
});

