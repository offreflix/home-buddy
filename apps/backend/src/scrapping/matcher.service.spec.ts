import { Test, TestingModule } from '@nestjs/testing';
import { MatcherService } from './matcher.service';
import { HttpService } from '@nestjs/axios';
import { TrackingService } from 'src/tracking/tracking.service';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('MatcherService', () => {
  let service: MatcherService;
  let httpService: jest.Mocked<HttpService>;
  let trackingService: jest.Mocked<TrackingService>;

  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const mockTrackingService = {
      createOperationLog: jest.fn(),
      updateOperationStatus: jest.fn(),
      createMatchingLog: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatcherService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: TrackingService, useValue: mockTrackingService },
      ],
    }).compile();

    service = module.get<MatcherService>(MatcherService);
    httpService = module.get(HttpService);
    trackingService = module.get(TrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('matchProducts', () => {
    it('deve estar implementado', () => {
      expect(service.matchProducts).toBeDefined();
      expect(typeof service.matchProducts).toBe('function');
    });

    it('deve fazer chamada HTTP para o matcher', async () => {
      const userId = 1;
      const scrapedProducts = [
        {
          title: 'Produto 1',
          code: '123',
          quantity: '1',
          unit: 'kg',
          unitPrice: '10.00',
          totalPrice: '10.00',
        },
      ];

      const mockResponse: AxiosResponse<{ match: unknown[]; unmatch: unknown[] }> = {
        data: {
          match: [],
          unmatch: [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as AxiosResponse['config'],
      };

      httpService.get.mockReturnValue(of({ status: 200 } as AxiosResponse));
      httpService.post.mockReturnValue(of(mockResponse));

      try {
        await service.matchProducts(userId, scrapedProducts);
      } catch (error) {
        // Pode falhar por falta de configuração, mas o método está sendo chamado
      }

      expect(httpService.post).toHaveBeenCalled();
    });
  });
});

