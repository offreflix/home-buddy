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

  // Métodos genéricos para PAT
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl && ttl > 0) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async sadd(key: string, ...members: string[]): Promise<void> {
    await this.redis.sadd(key, ...members);
  }

  async smembers(key: string): Promise<string[]> {
    return await this.redis.smembers(key);
  }

  async srem(key: string, ...members: string[]): Promise<void> {
    await this.redis.srem(key, ...members);
  }
}
