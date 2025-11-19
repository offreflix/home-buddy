import { ApiProperty } from '@nestjs/swagger';

export class QueueStatsDto {
  @ApiProperty({ description: 'Número de jobs aguardando' })
  waiting: number;

  @ApiProperty({ description: 'Número de jobs ativos' })
  active: number;

  @ApiProperty({ description: 'Número de jobs completados' })
  completed: number;

  @ApiProperty({ description: 'Número de jobs falhados' })
  failed: number;

  @ApiProperty({ description: 'Total de jobs' })
  total: number;
}


