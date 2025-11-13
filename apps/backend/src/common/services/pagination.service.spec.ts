import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';
import { createMockRequest } from 'src/common/test-helpers/mock-factories';
import { Request } from 'express';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPaginationOptions', () => {
    it('deve retornar opções padrão quando query está vazia', () => {
      const result = service.createPaginationOptions({});

      expect(result).toEqual({
        page: 1,
        perPage: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
    });

    it('deve usar valores da query quando fornecidos', () => {
      const query = {
        page: 2,
        perPage: 20,
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      const result = service.createPaginationOptions(query);

      expect(result).toEqual({
        page: 2,
        perPage: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      });
    });

    it('deve limitar perPage a 100 no máximo', () => {
      const query = { perPage: 200 };

      const result = service.createPaginationOptions(query);

      expect(result.perPage).toBe(100);
    });

    it('deve garantir page mínimo de 1', () => {
      const query = { page: 0 };

      const result = service.createPaginationOptions(query);

      expect(result.page).toBe(1);
    });

    it('deve permitir perPage 0 para ilimitado', () => {
      const query = { perPage: 0 };

      const result = service.createPaginationOptions(query);

      expect(result.perPage).toBe(0);
    });
  });

  describe('getPrismaPaginationOptions', () => {
    it('deve retornar skip e take corretos para paginação normal', () => {
      const options = {
        page: 2,
        perPage: 10,
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      const result = service.getPrismaPaginationOptions(options);

      expect(result).toEqual({
        skip: 10,
        take: 10,
        orderBy: { name: 'asc' },
      });
    });

    it('deve retornar take como MAX_UNLIMITED_ITEMS quando perPage é 0', () => {
      const options = {
        page: 1,
        perPage: 0,
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      const result = service.getPrismaPaginationOptions(options);

      expect(result.take).toBe(1000);
      expect(result.skip).toBeUndefined();
    });
  });

  describe('createPaginationMeta', () => {
    it('deve calcular meta corretamente para paginação normal', () => {
      const meta = service.createPaginationMeta(2, 10, 25);

      expect(meta).toEqual({
        page: 2,
        perPage: 10,
        total: 25,
        totalPages: 3,
        hasNextPage: true,
        hasPrevPage: true,
        from: 11,
        to: 20,
      });
    });

    it('deve calcular meta corretamente quando perPage é 0 (ilimitado)', () => {
      const meta = service.createPaginationMeta(1, 0, 25);

      expect(meta).toEqual({
        page: 1,
        perPage: 25,
        total: 25,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
        from: 1,
        to: 25,
      });
    });

    it('deve indicar hasNextPage como false na última página', () => {
      const meta = service.createPaginationMeta(3, 10, 25);

      expect(meta.hasNextPage).toBe(false);
      expect(meta.hasPrevPage).toBe(true);
    });

    it('deve indicar hasPrevPage como false na primeira página', () => {
      const meta = service.createPaginationMeta(1, 10, 25);

      expect(meta.hasPrevPage).toBe(false);
      expect(meta.hasNextPage).toBe(true);
    });
  });

  describe('createPaginationLinks', () => {
    it('deve criar links corretos', () => {
      const req = createMockRequest({
        protocol: 'https',
        get: jest.fn().mockReturnValue('api.example.com'),
        path: '/products',
        query: { page: '2', perPage: '10' },
      });

      const links = service.createPaginationLinks(req as Request, 2, 10, 3);

      expect(links).toHaveProperty('self');
      expect(links).toHaveProperty('next');
      expect(links).toHaveProperty('prev');
      expect(links).toHaveProperty('first');
      expect(links).toHaveProperty('last');
      expect(links.next).toBeTruthy();
      expect(links.prev).toBeTruthy();
    });

    it('deve retornar null para next na última página', () => {
      const req = createMockRequest();
      const links = service.createPaginationLinks(req as Request, 3, 10, 3);

      expect(links.next).toBeNull();
    });

    it('deve retornar null para prev na primeira página', () => {
      const req = createMockRequest();
      const links = service.createPaginationLinks(req as Request, 1, 10, 3);

      expect(links.prev).toBeNull();
    });
  });

  describe('paginate', () => {
    it('deve paginar dados corretamente', async () => {
      const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
      const options = {
        page: 2,
        perPage: 10,
        sortBy: 'id',
        sortOrder: 'asc' as const,
      };

      const result = await service.paginate(data, options);

      expect(result).toHaveLength(10);
      expect(result[0].id).toBe(11);
    });

    it('deve ordenar dados corretamente', async () => {
      const data = [
        { id: 3, name: 'C' },
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ];
      const options = {
        page: 1,
        perPage: 10,
        sortBy: 'name',
        sortOrder: 'asc' as const,
      };

      const result = await service.paginate(data, options);

      expect(result[0].name).toBe('A');
      expect(result[1].name).toBe('B');
      expect(result[2].name).toBe('C');
    });
  });

  describe('createPaginatedResponse', () => {
    it('deve criar resposta paginada completa', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const total = 2;
      const options = {
        page: 1,
        perPage: 10,
        sortBy: 'id',
        sortOrder: 'desc' as const,
      };
      const req = createMockRequest();

      const result = service.createPaginatedResponse(data, total, options, req as Request);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('meta');
      expect(result).toHaveProperty('links');
      expect(result.data).toEqual(data);
    });
  });

  describe('getMaxUnlimitedItems', () => {
    it('deve retornar 1000', () => {
      const result = service.getMaxUnlimitedItems();

      expect(result).toBe(1000);
    });
  });
});



