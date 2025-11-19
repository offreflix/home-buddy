import { Test, TestingModule } from '@nestjs/testing';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';
import { createMockUser, createMockUserEntity, createMockResponse } from 'src/common/test-helpers/mock-factories';

describe('ExportController', () => {
  let controller: ExportController;
  let service: ExportService;

  const mockUser = createMockUserEntity({ id: 1 });

  beforeEach(async () => {
    const mockService = {
      exportProductsAsCsv: jest.fn(),
      generateStockSummaryReport: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportController],
      providers: [
        {
          provide: ExportService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExportController>(ExportController);
    service = module.get<ExportService>(ExportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('exportProducts', () => {
    it('deve exportar produtos como CSV', async () => {
      const dto = { lowStock: false };
      const mockResponse = createMockResponse();
      const mockCsv = 'Nome,Descrição\nProduto 1,Descrição 1';

      jest.spyOn(service, 'exportProductsAsCsv').mockResolvedValue(mockCsv);

      await controller.exportProducts(dto, mockUser, mockResponse);

      expect(service.exportProductsAsCsv).toHaveBeenCalledWith(mockUser, dto);
      expect(mockResponse.setHeader).toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith(mockCsv);
    });
  });

  describe('generateStockSummaryReport', () => {
    it('deve gerar relatório de estoque', async () => {
      const mockReport = {
        summary: {
          totalProducts: 10,
          lowStockProducts: 2,
          outOfStockProducts: 1,
          totalCategories: 3,
          totalStockQuantity: 100,
          totalDesiredQuantity: 200,
        },
        generatedAt: new Date().toISOString(),
      };

      jest.spyOn(service, 'generateStockSummaryReport').mockResolvedValue(mockReport);

      const result = await controller.generateStockSummaryReport(mockUser);

      expect(result).toEqual(mockReport);
      expect(service.generateStockSummaryReport).toHaveBeenCalledWith(mockUser);
    });
  });
});



