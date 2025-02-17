import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const existingUsername = await this.usersService.findByUsername(
      createUserDto.username,
    );

    const existingEmail = await this.usersService.findByEmail(
      createUserDto.email,
    );

    if (existingUsername || existingEmail) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.usersService.createUser({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    });

    const payload = { username: user.username, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findByUsername(signInDto.username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    await this.redisService.setToken(
      `accessToken:${user.id.toString()}`,
      accessToken,
      900,
    );
    await this.redisService.setToken(
      `refreshToken:${user.id.toString()}`,
      refreshToken,
      604800,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.redisService.removeToken(`accessToken:${userId.toString()}`);
    await this.redisService.removeToken(`refreshToken:${userId.toString()}`);
  }

  async decodeToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const userId = payload.sub;

      const redisToken = await this.redisService.getToken(
        `accessToken:${userId.toString()}`,
      );

      return redisToken === token;
    } catch {
      return false;
    }
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async removeToken(userId: number): Promise<void> {
    await this.redisService.removeToken(userId.toString());
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const decoded = this.jwtService.verify(refreshToken);

      const userId = decoded?.sub;

      const redisToken = await this.redisService.getToken(
        `refreshToken:${userId.toString()}`,
      );

      if (redisToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token inválido.');
      }

      if (!userId) {
        throw new UnauthorizedException('Refresh token inválido.');
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado.');
      }

      const payload = { username: user.username, sub: user.id };

      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
      });

      await this.redisService.setToken(
        `accessToken:${userId.toString()}`,
        newAccessToken,
        900,
      );
      await this.redisService.setToken(
        `refreshToken:${userId.toString()}`,
        newRefreshToken,
        604800,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido ou expirado.');
    }
  }
}
