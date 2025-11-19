import { Test, TestingModule } from '@nestjs/testing';
import { ScrappingService } from './scrapping.service';

jest.mock('puppeteer-core', () => ({
  launch: jest.fn(),
}));

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

  describe('scrapeNFC', () => {
    it('deve estar implementado', () => {
      expect(service.scrapeNFC).toBeDefined();
      expect(typeof service.scrapeNFC).toBe('function');
    });
  });
});
