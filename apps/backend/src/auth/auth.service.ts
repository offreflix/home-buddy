import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RedisService } from '../redis/redis.service';
import { Response } from 'express';
import { AuthenticatedUser, AuthRequest } from './auth.controller';

interface GoogleUser {
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  googleId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ id: number; username: string; email: string }> {
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

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
      throw new ConflictException('User already exists');
    }

    const user = await this.usersService.createUser({
      username: createUserDto.username,
      email: createUserDto.email,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  async signIn(
    user: AuthenticatedUser,
  ): Promise<{ access_token: string; refresh_token: string }> {
    return this.generateTokens(user);
  }

  private async generateTokens(user: AuthenticatedUser) {
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

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { ...result } = user;
    return result;
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
        throw new UnauthorizedException('Invalid refresh token');
      }

      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async validateOrCreateGoogleUser(googleUser: GoogleUser) {
    try {
      let user = await this.usersService.findByGoogleId(googleUser.googleId);

      if (!user) {
        user = await this.usersService.findByEmail(googleUser.email);

        if (user) {
          return { error: 'user_conflict' };
          // user = await this.usersService.updateUser({
          //   where: { id: user.id },
          //   data: {
          //     googleId: googleUser.googleId,
          //     firstName: googleUser.firstName,
          //     lastName: googleUser.lastName,
          //     picture: googleUser.picture,
          //   },
          // });
        } else {
          let username = googleUser.username;
          const existingUsername =
            await this.usersService.findByUsername(username);

          if (existingUsername) {
            username = `${username}${Math.floor(Math.random() * 1000)}`;
          }

          user = await this.usersService.createUser({
            username: username,
            email: googleUser.email,
            googleId: googleUser.googleId,
            firstName: googleUser.firstName,
            lastName: googleUser.lastName,
            picture: googleUser.picture,
          });
        }
      }

      return {
        id: user.id,
        username: user.username,
        email: user.email,
      };
    } catch (error) {
      console.error('Erro ao validar/criar usuário Google:', error);
      throw error;
    }
  }

  async googleAuthCallback(req: AuthRequest, res: Response) {
    try {
      const tokens = await this.signIn(req.user);

      res.cookie('access_token', tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000, // 15 minutos
        sameSite: 'lax',
        path: '/',
      });

      res.cookie('refresh_token', tokens.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
        sameSite: 'lax',
        path: '/',
      });

      res.send(`
        <script>
          window.opener.postMessage(
            {
              access_token: '${tokens.access_token}',
              refresh_token: '${tokens.refresh_token}'
            },
            '${process.env.FRONTEND_URL}'
          );
          window.close();
        </script>
      `);
    } catch (error) {
      console.error('Erro no callback do Google:', error);
      res.send(`
        <script>
          window.opener.postMessage(
            { error: 'auth_failed' },
            '${process.env.FRONTEND_URL}'
          );
          window.close();
        </script>
      `);
    }
  }
}
