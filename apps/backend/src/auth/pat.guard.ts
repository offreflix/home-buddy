import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PatService } from './pat.service';

@Injectable()
export class PatGuard implements CanActivate {
  constructor(
    private readonly patService: PatService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Personal Access Token não fornecido');
    }

    // Validar token
    const pat = await this.patService.validateToken(token);
    if (!pat) {
      throw new UnauthorizedException(
        'Personal Access Token inválido ou expirado',
      );
    }

    // Debug: log do PAT encontrado
    console.log('PAT encontrado:', {
      id: pat.id,
      name: pat.name,
      permissions: pat.permissions,
      userId: pat.userId,
    });

    // Verificar permissões necessárias
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (requiredPermissions) {
      const hasPermission = requiredPermissions.some((permission) =>
        this.patService.hasPermission(pat, permission),
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Token não possui permissões necessárias: ${requiredPermissions.join(', ')}`,
        );
      }
    }

    // Adicionar informações do PAT ao request
    request.pat = pat;
    request.user = {
      id: pat.userId,
      type: 'pat',
      permissions: pat.permissions,
    };

    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
