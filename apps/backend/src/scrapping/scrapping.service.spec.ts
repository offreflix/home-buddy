import { Test, TestingModule } from '@nestjs/testing';
import { ScrappingService } from './scrapping.service';

describe('ScrappingService', () => {
  let service: ScrappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScrappingService],
    }).compile();

    service = module.get<ScrappingService>(ScrappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
