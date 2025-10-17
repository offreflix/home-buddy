import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class McpJwtStrategy extends PassportStrategy(Strategy, 'mcp-jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessSecret, // Usar o mesmo secret por enquanto
    });
  }

  async validate(payload: any) {
    // Verificar se é um token MCP válido
    if (payload.type !== 'mcp') {
      throw new UnauthorizedException('Token não é válido para MCP');
    }

    // Verificar se o token não expirou
    if (payload.exp && payload.exp < Date.now() / 1000) {
      throw new UnauthorizedException('Token MCP expirado');
    }

    return {
      id: payload.sub,
      username: payload.username,
      type: 'mcp',
      permissions: payload.permissions || ['read:products', 'read:categories'],
    };
  }
}








