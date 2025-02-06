import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SignInDto } from 'src/users/dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
  ): Promise<{ access_token: string }> {
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

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(signInDto.username);

    console.log(signInDto);

    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(signInDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
