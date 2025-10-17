import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { RedisModule } from '../redis/redis.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { McpJwtStrategy } from './strategies/mcp-jwt.strategy';
import { InternalGuard } from './internal.guard';
import { McpGuard } from './mcp.guard';
import { PatController } from './pat.controller';
import { PatService } from './pat.service';
import { PatGuard } from './pat.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.accessSecret,
      signOptions: { expiresIn: '15m' },
    }),
    RedisModule,
  ],
  controllers: [AuthController, PatController],
  providers: [
    AuthService,
    PrismaService,
    UsersService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    McpJwtStrategy,
    InternalGuard,
    McpGuard,
    PatService,
    PatGuard,
  ],
  exports: [AuthService, PatService, PatGuard],
})
export class AuthModule {}
