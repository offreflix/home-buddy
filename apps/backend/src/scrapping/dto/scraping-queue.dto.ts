import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsNumberString,
} from 'class-validator';
import { MatchResultDto } from './match-result.dto';

export class AddToQueueDto {
  @ApiProperty({
    description: 'URL da página para fazer scraping',
    example: 'https://www.sefaz.rs.gov.br/nfce/nfce-pesquisa.jsp',
  })
  @IsString()
  @IsUrl()
  url: string;

  @ApiProperty({
    description: 'ID do usuário (opcional)',
    example: 5,
    required: false,
  })
  @IsOptional()
  userId?: number;
}

export class AddMultipleToQueueDto {
  @ApiProperty({
    description: 'Array de URLs para fazer scraping',
    example: [
      'https://www.sefaz.rs.gov.br/nfce/nfce-pesquisa.jsp',
      'https://www.sefaz.rs.gov.br/nfce/nfce-pesquisa.jsp',
    ],
    type: [String],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  urls: string[];

  @ApiProperty({
    description: 'ID do usuário (opcional)',
    example: 5,
    required: false,
  })
  @IsOptional()
  userId?: number;
}

export class JobStatusResponseDto {
  @ApiProperty({ description: 'ID do job' })
  jobId: string;

  @ApiProperty({ description: 'Estado atual do job' })
  state: string;

  @ApiProperty({ description: 'Progresso do job (0-100)' })
  progress: number;

  @ApiProperty({ description: 'Resultado do job (se concluído)' })
  result?: any;

  @ApiProperty({
    description: 'Resultado do matching (se disponível)',
    required: false,
  })
  matchResult?: MatchResultDto;

  @ApiProperty({ description: 'Dados do job' })
  data: any;
}
