import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setToken(key: string, token: string, expiresIn: number): Promise<void> {
    await this.redis.set(`auth:${key}`, token, 'EX', expiresIn);
  }

  async getToken(key: string): Promise<string | null> {
    return await this.redis.get(`auth:${key}`);
  }

  async removeToken(key: string): Promise<void> {
    await this.redis.del(`auth:${key}`);
  }

  async addUserSession(userId: number, jti: string): Promise<void> {
    await this.redis.sadd(`auth:userSessions:${userId}`, jti);
  }

  async removeUserSession(userId: number, jti: string): Promise<void> {
    await this.redis.srem(`auth:userSessions:${userId}`, jti);
  }
}
