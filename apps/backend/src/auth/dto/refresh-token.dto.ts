import { IsJWT, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  @IsNotEmpty()
  @IsString()
  @IsJWT()
  refresh_token: string;
}
