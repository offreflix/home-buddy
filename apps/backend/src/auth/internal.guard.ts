import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class InternalGuard implements CanActivate {
  private readonly expectedToken = process.env.INTERNAL_TOKEN;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token: string | undefined = request.headers['x-service-token'];

    if (!token || token !== this.expectedToken) {
      throw new UnauthorizedException('Invalid internal service token');
    }

    return true;
  }
}
