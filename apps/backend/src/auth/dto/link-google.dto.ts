import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class LinkGoogleDto {
  @ApiProperty({ description: 'ID do Google do usuário' })
  @IsString()
  googleId: string;

  @ApiProperty({ description: 'Email do usuário', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Username do usuário', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: 'Primeiro nome do usuário', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Sobrenome do usuário', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'URL da foto do perfil', required: false })
  @IsOptional()
  @IsString()
  picture?: string;
}


