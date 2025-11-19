import { Test, TestingModule } from '@nestjs/testing';
import { ExportService } from './export.service';
import { PrismaService } from 'src/prisma.service';
import { Unit } from '@prisma/client';
import { createMockPrismaService, createMockUser, createMockUserEntity } from 'src/common/test-helpers/mock-factories';
import { ProductWithRelations } from 'src/common/types/prisma.types';

describe('ExportService', () => {
  let service: ExportService;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExportService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExportService>(ExportService);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('exportProductsAsCsv', () => {
    it('deve exportar produtos como CSV', async () => {
      const mockUser = createMockUserEntity({ id: 1 });
      const dto = { lowStock: false };

      const mockProducts = [
        {
          id: 1,
          name: 'Produto 1',
          description: 'Descrição 1',
          unit: Unit.kg,
          category: { name: 'Categoria 1' },
          stock: {
            currentQuantity: 10,
            desiredQuantity: 20,
          },
          createdAt: new Date('2024-01-01'),
        },
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(mockProducts as ProductWithRelations[]);

      const result = await service.exportProductsAsCsv(mockUser, dto);

      expect(result).toContain('Nome');
      expect(result).toContain('Produto 1');
      expect(prismaService.product.findMany).toHaveBeenCalled();
    });

    it('deve filtrar produtos com estoque baixo quando lowStock é true', async () => {
      const mockUser = createMockUserEntity({ id: 1 });
      const dto = { lowStock: true };

      const mockProducts = [
        {
          id: 1,
          name: 'Produto Baixo',
          description: 'Descrição',
          unit: Unit.kg,
          category: { name: 'Categoria' },
          stock: {
            currentQuantity: 2,
            desiredQuantity: 10, // 2 < 10 * 0.4 = 4
          },
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 2,
          name: 'Produto Normal',
          description: 'Descrição',
          unit: Unit.kg,
          category: { name: 'Categoria' },
          stock: {
            currentQuantity: 5,
            desiredQuantity: 10, // 5 >= 4
          },
          createdAt: new Date('2024-01-01'),
        },
      ];

      (prismaService.product.findMany as jest.Mock).mockResolvedValue(mockProducts as ProductWithRelations[]);

      const result = await service.exportProductsAsCsv(mockUser, dto);

      expect(result).toContain('Produto Baixo');
      expect(result).not.toContain('Produto Normal');
    });
  });
});

