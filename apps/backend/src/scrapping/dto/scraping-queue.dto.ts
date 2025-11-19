import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  IsNumberString,
} from 'class-validator';
import { MatchResultDto } from './match-result.dto';
import { ScrapingJobResult } from '../scrapping-queue.processor';
import { ScrapingJobData } from '../scrapping-queue.processor';

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
  @ApiProperty({ description: 'ID do job', required: false })
  jobId?: string;

  @ApiProperty({ description: 'Estado atual do job', required: false })
  state?: string;

  @ApiProperty({ description: 'Progresso do job (0-100)', required: false })
  progress?: number;

  @ApiProperty({ description: 'Mensagem de status', required: false })
  message?: string;

  @ApiProperty({ description: 'Fase do processamento', required: false })
  phase?: string;

  @ApiProperty({ description: 'Resultado do job (se concluído)', required: false })
  result?: ScrapingJobResult;

  @ApiProperty({
    description: 'Resultado do matching (se disponível)',
    required: false,
  })
  matchResult?: MatchResultDto;

  @ApiProperty({ description: 'Razão da falha (se falhou)', required: false })
  failedReason?: string;

  @ApiProperty({ description: 'Dados do job', required: false })
  data?: ScrapingJobData;

  @ApiProperty({ description: 'Timestamp do job', required: false })
  timestamp?: number;

  @ApiProperty({ description: 'Data de processamento', required: false })
  processedOn?: number | null;

  @ApiProperty({ description: 'Data de finalização', required: false })
  finishedOn?: number | null;

  @ApiProperty({ description: 'Mensagem de erro (se houver)', required: false })
  error?: string;
}
