import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { randomBytes } from 'crypto';

export interface PersonalAccessToken {
  id: string;
  name: string;
  userId: number;
  permissions: string[];
  createdAt: Date;
  expiresAt?: Date;
  lastUsedAt?: Date;
}

@Injectable()
export class PatService {
  private readonly PAT_PREFIX = 'pat:';
  private readonly USER_PATS_PREFIX = 'user:pats:';

  constructor(private readonly redisService: RedisService) {}

  /**
   * Gera um novo Personal Access Token
   */
  async generateToken(
    userId: number,
    name: string,
    permissions: string[],
    expiresInDays?: number,
  ): Promise<{ token: string; pat: PersonalAccessToken }> {
    // Gerar token único
    const tokenId = randomBytes(16).toString('hex');
    const token = `pat_${tokenId}`;

    // Calcular expiração
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const pat: PersonalAccessToken = {
      id: tokenId,
      name,
      userId,
      permissions,
      createdAt: new Date(),
      expiresAt,
    };

    // Salvar no Redis
    const key = `${this.PAT_PREFIX}${token}`;
    const ttl = expiresAt
      ? Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      : -1;

    const patJson = JSON.stringify(pat);
    console.log('Salvando PAT no Redis:', {
      key,
      patJson,
      ttl,
    });

    await this.redisService.set(key, patJson, ttl);

    // Adicionar à lista de PATs do usuário
    const userPatsKey = `${this.USER_PATS_PREFIX}${userId}`;
    await this.redisService.sadd(userPatsKey, token);

    return { token, pat };
  }

  /**
   * Valida um Personal Access Token
   */
  async validateToken(token: string): Promise<PersonalAccessToken | null> {
    const key = `${this.PAT_PREFIX}${token}`;
    console.log('Buscando PAT no Redis com chave:', key);

    const patData = await this.redisService.get(key);
    console.log('Dados do PAT encontrados:', patData);

    if (!patData) {
      console.log('PAT não encontrado no Redis');
      return null;
    }

    const pat: PersonalAccessToken = JSON.parse(patData);
    console.log('PAT parseado:', pat);

    // Verificar se expirou
    if (pat.expiresAt && new Date() > pat.expiresAt) {
      await this.revokeToken(token);
      return null;
    }

    // Atualizar último uso
    pat.lastUsedAt = new Date();
    await this.redisService.set(key, JSON.stringify(pat));

    return pat;
  }

  /**
   * Lista todos os PATs de um usuário
   */
  async getUserTokens(userId: number): Promise<PersonalAccessToken[]> {
    const userPatsKey = `${this.USER_PATS_PREFIX}${userId}`;
    const tokens = await this.redisService.smembers(userPatsKey);

    const pats: PersonalAccessToken[] = [];

    for (const token of tokens) {
      const key = `${this.PAT_PREFIX}${token}`;
      const patData = await this.redisService.get(key);

      if (patData) {
        const pat: PersonalAccessToken = JSON.parse(patData);
        // Não incluir o token real por segurança
        pats.push({
          ...pat,
          id: pat.id, // Manter apenas o ID
        });
      }
    }

    return pats;
  }

  /**
   * Revoga um Personal Access Token
   */
  async revokeToken(token: string): Promise<boolean> {
    const key = `${this.PAT_PREFIX}${token}`;
    const patData = await this.redisService.get(key);

    if (!patData) {
      return false;
    }

    const pat: PersonalAccessToken = JSON.parse(patData);

    // Remover do Redis
    await this.redisService.del(key);

    // Remover da lista do usuário
    const userPatsKey = `${this.USER_PATS_PREFIX}${pat.userId}`;
    await this.redisService.srem(userPatsKey, token);

    return true;
  }

  /**
   * Revoga todos os PATs de um usuário
   */
  async revokeAllUserTokens(userId: number): Promise<number> {
    const userPatsKey = `${this.USER_PATS_PREFIX}${userId}`;
    const tokens = await this.redisService.smembers(userPatsKey);

    let revokedCount = 0;

    for (const token of tokens) {
      const key = `${this.PAT_PREFIX}${token}`;
      await this.redisService.del(key);
      revokedCount++;
    }

    // Limpar lista do usuário
    await this.redisService.del(userPatsKey);

    return revokedCount;
  }

  /**
   * Verifica se um token tem uma permissão específica
   */
  hasPermission(pat: PersonalAccessToken, permission: string): boolean {
    if (!pat || !pat.permissions || !Array.isArray(pat.permissions)) {
      return false;
    }
    return (
      pat.permissions.includes(permission) || pat.permissions.includes('*')
    );
  }
}
