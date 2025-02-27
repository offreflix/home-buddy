import { Test, TestingModule } from '@nestjs/testing';
import { ScrappingController } from './scrapping.controller';

describe('ScrappingController', () => {
  let controller: ScrappingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrappingController],
    }).compile();

    controller = module.get<ScrappingController>(ScrappingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
