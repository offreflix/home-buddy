import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from './auth.guard';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    console.log(req.user);
    const userProfile = await this.authService.getProfile(req.user.sub);
    return userProfile;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    await this.authService.removeToken(req.user.sub);
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() data: RefreshTokenDto) {
    const tokens = await this.authService.refreshToken(data.refresh_token);
    return tokens;
  }
}
