import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';
import { Redis } from 'ioredis';
import { User } from '@prisma/client';

describe('RedisService', () => {
  let service: RedisService;
  let redis: jest.Mocked<Redis>;

  beforeEach(async () => {
    const mockRedis = {
      set: jest.fn().mockResolvedValue('OK'),
      get: jest.fn().mockResolvedValue(null),
      del: jest.fn().mockResolvedValue(1),
      sadd: jest.fn().mockResolvedValue(1),
      srem: jest.fn().mockResolvedValue(1),
    } as unknown as jest.Mocked<Redis>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: 'default_IORedisModuleConnectionToken',
          useValue: mockRedis,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
    redis = (service as unknown as { redis: jest.Mocked<Redis> }).redis;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setToken', () => {
    it('deve salvar token no Redis com TTL', async () => {
      const key = 'test-key';
      const token = 'test-token';
      const expiresIn = 3600;

      redis.set.mockResolvedValue('OK');

      await service.setToken(key, token, expiresIn);

      expect(redis.set).toHaveBeenCalledWith(
        `auth:${key}`,
        token,
        'EX',
        expiresIn,
      );
    });
  });

  describe('getToken', () => {
    it('deve retornar token do Redis', async () => {
      const key = 'test-key';
      const token = 'test-token';

      redis.get.mockResolvedValue(token);

      const result = await service.getToken(key);

      expect(result).toBe(token);
      expect(redis.get).toHaveBeenCalledWith(`auth:${key}`);
    });

    it('deve retornar null quando token não existe', async () => {
      const key = 'nonexistent';

      redis.get.mockResolvedValue(null);

      const result = await service.getToken(key);

      expect(result).toBeNull();
    });
  });

  describe('removeToken', () => {
    it('deve remover token do Redis', async () => {
      const key = 'test-key';

      redis.del.mockResolvedValue(1);

      await service.removeToken(key);

      expect(redis.del).toHaveBeenCalledWith(`auth:${key}`);
    });
  });

  describe('addUserSession', () => {
    it('deve adicionar sessão do usuário', async () => {
      const userId = 1;
      const jti = 'session-id';

      redis.sadd.mockResolvedValue(1);

      await service.addUserSession(userId, jti);

      expect(redis.sadd).toHaveBeenCalledWith(`auth:userSessions:${userId}`, jti);
    });
  });

  describe('removeUserSession', () => {
    it('deve remover sessão do usuário', async () => {
      const userId = 1;
      const jti = 'session-id';

      redis.srem.mockResolvedValue(1);

      await service.removeUserSession(userId, jti);

      expect(redis.srem).toHaveBeenCalledWith(`auth:userSessions:${userId}`, jti);
    });
  });
});

