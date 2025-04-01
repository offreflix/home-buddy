import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { Request } from 'express';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request: Request) => {
          return request.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const token =
      ExtractJwt.fromAuthHeaderAsBearerToken()(req) ||
      req.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException();
    }

    const redisToken = await this.redisService.getToken(
      `accessToken:${payload.sub.toString()}`,
    );

    if (redisToken !== token) {
      throw new UnauthorizedException();
    }

    return { id: payload.sub, username: payload.username };
  }
}
