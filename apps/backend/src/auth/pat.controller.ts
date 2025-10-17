import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';
import { JwtAuthGuard } from './auth.guard';
import { PatGuard } from './pat.guard';
import { PatService } from './pat.service';
import { RequirePermissions } from './permissions.decorator';

export class CreatePatDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsOptional()
  @IsNumber()
  expiresInDays?: number;
}

export class RevokePatDto {
  token: string;
}

@Controller('auth/pat')
export class PatController {
  constructor(private readonly patService: PatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPat(@Request() req: any, @Body() createPatDto: CreatePatDto) {
    console.log('Criando PAT com dados:', {
      userId: req.user.id,
      createPatDto,
    });

    const { token, pat } = await this.patService.generateToken(
      req.user.id,
      createPatDto.name,
      createPatDto.permissions,
      createPatDto.expiresInDays,
    );

    return {
      token, // Só retorna uma vez
      pat: {
        id: pat.id,
        name: pat.name,
        permissions: pat.permissions,
        createdAt: pat.createdAt,
        expiresAt: pat.expiresAt,
      },
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserPats(@Request() req: any) {
    return this.patService.getUserTokens(req.user.id);
  }

  @Delete(':token')
  @UseGuards(JwtAuthGuard)
  async revokePat(@Request() req: any, @Param('token') token: string) {
    // Verificar se o token pertence ao usuário
    const pat = await this.patService.validateToken(token);
    if (!pat || pat.userId !== req.user.id) {
      throw new Error('Token não encontrado ou não pertence ao usuário');
    }

    const success = await this.patService.revokeToken(token);
    return { success, message: 'Token revogado com sucesso' };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async revokeAllUserPats(@Request() req: any) {
    const count = await this.patService.revokeAllUserTokens(req.user.id);
    return {
      success: true,
      message: `${count} tokens revogados com sucesso`,
      revokedCount: count,
    };
  }

  @Get('validate')
  @UseGuards(PatGuard)
  @RequirePermissions('read:profile')
  async validatePat(@Request() req: any) {
    return {
      valid: true,
      pat: req.pat,
      user: req.user,
    };
  }
}
