import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async setToken(
    userId: string,
    token: string,
    expiresIn: number,
  ): Promise<void> {
    await this.redis.set(`auth:${userId}`, token, 'EX', expiresIn);
  }

  async getToken(userId: string): Promise<string | null> {
    return await this.redis.get(`auth:${userId}`);
  }

  async removeToken(userId: string): Promise<void> {
    await this.redis.del(`auth:${userId}`);
  }
}
