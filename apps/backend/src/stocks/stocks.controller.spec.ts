import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { createMockUser, createMockUserEntity } from 'src/common/test-helpers/mock-factories';

describe('StocksController', () => {
  let controller: StocksController;
  let service: StocksService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    service = module.get<StocksService>(StocksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create', () => {
      const dto = {
        productId: 1,
        desiredQuantity: 10,
        currentQuantity: 0,
      };
      const mockResult = 'This action adds a new stock';

      jest.spyOn(service, 'create').mockReturnValue(mockResult);

      const result = controller.create(dto);

      expect(result).toBe(mockResult);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve chamar service.findAll', () => {
      const mockResult = 'This action returns all stocks';

      jest.spyOn(service, 'findAll').mockReturnValue(mockResult);

      const result = controller.findAll();

      expect(result).toBe(mockResult);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve chamar service.findOne', () => {
      const id = '1';
      const mockResult = 'This action returns a #1 stock';

      jest.spyOn(service, 'findOne').mockReturnValue(mockResult);

      const result = controller.findOne(id);

      expect(result).toBe(mockResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve chamar service.update', () => {
      const id = '1';
      const dto = {
        productId: 1,
        currentQuantity: 10,
        type: 'IN' as const,
      };
      const mockUser = createMockUserEntity({ id: 1 });
      const mockResult = 'This action updateas a #1 stock';

      jest.spyOn(service, 'update').mockReturnValue(mockResult);

      const result = controller.update(id, dto, mockUser);

      expect(result).toBe(mockResult);
      expect(service.update).toHaveBeenCalledWith(1, dto, mockUser);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove', () => {
      const id = '1';
      const mockResult = 'This action removes a #1 stock';

      jest.spyOn(service, 'remove').mockReturnValue(mockResult);

      const result = controller.remove(id);

      expect(result).toBe(mockResult);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
