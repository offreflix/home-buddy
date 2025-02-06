import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User as UserModel } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  async signupUser(
    @Body() userData: { username: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.usersService.createUser(userData);
  }
}
