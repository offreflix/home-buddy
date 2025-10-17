import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  JwtAuthGuard,
  LocalAuthGuard,
  GoogleAuthGuard,
  Public,
} from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { SignInDto } from 'src/users/dto/sign-in.dto';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  picture: string | null;
  googleId: string | null;
  createdAt: Date;
  updatedAt: Date;
  jti?: string;
}

export interface AuthRequest extends Request {
  user: AuthenticatedUser;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @ApiBody({ type: SignInDto })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Request() req: AuthRequest) {
    return this.authService.signIn(req.user);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthRequest) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req: AuthRequest) {
    const authHeader = (req.headers as any)['authorization'];
    const token =
      authHeader?.split(' ')[1] || (req as any).cookies?.access_token;

    await this.authService.logout(req.user.id, token);

    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshToken(data.refresh_token);
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('verify-cookie')
  @UseGuards(JwtAuthGuard)
  async verifyCookies() {
    return { message: 'Autenticado com cookie!' };
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req: AuthRequest, @Res() res: Response) {
    return this.authService.googleAuthCallback(req, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('link-google')
  async linkGoogleAccount(
    @Request() req: AuthRequest,
    @Body() googleData: any,
  ) {
    return this.authService.linkGoogleAccount(req.user.id, googleData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mcp/token')
  async generateMcpToken(@Request() req: AuthRequest) {
    const token = await this.authService.generateMcpToken(req.user);
    return {
      token,
      expiresIn: 30 * 24 * 60 * 60, // 30 dias em segundos
      permissions: ['read:products', 'read:categories', 'read:stock'],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('mcp/status')
  async getMcpStatus(@Request() req: AuthRequest) {
    return {
      userId: req.user.id,
      username: req.user.username,
      mcpEnabled: true,
    };
  }
}
