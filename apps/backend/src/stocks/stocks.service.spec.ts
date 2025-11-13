import { Test, TestingModule } from '@nestjs/testing';
import { StocksService } from './stocks.service';
import { createMockUser, createMockUserEntity } from 'src/common/test-helpers/mock-factories';

describe('StocksService', () => {
  let service: StocksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StocksService],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve retornar mensagem de criação', () => {
      const result = service.create({
        productId: 1,
        desiredQuantity: 10,
        currentQuantity: 0,
      });

      expect(result).toBe('This action adds a new stock');
    });
  });

  describe('findAll', () => {
    it('deve retornar mensagem de listagem', () => {
      const result = service.findAll();

      expect(result).toBe('This action returns all stocks');
    });
  });

  describe('findOne', () => {
    it('deve retornar mensagem com id', () => {
      const id = 1;
      const result = service.findOne(id);

      expect(result).toBe(`This action returns a #${id} stock`);
    });
  });

  describe('update', () => {
    it('deve retornar mensagem de atualização', () => {
      const id = 1;
      const mockUser = createMockUserEntity({ id: 1 });
      const result = service.update(id, {
        productId: 1,
        currentQuantity: 10,
        type: 'IN' as const,
      }, mockUser);

      expect(result).toBe(`This action updateas a #${id} stock`);
    });
  });

  describe('remove', () => {
    it('deve retornar mensagem de remoção', () => {
      const id = 1;
      const result = service.remove(id);

      expect(result).toBe(`This action removes a #${id} stock`);
    });
  });
});
