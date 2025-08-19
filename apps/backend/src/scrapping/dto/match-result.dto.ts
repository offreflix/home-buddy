import { ApiProperty } from '@nestjs/swagger';

export class ProductScrapDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty({ required: false })
  quantity?: string;

  @ApiProperty({ required: false })
  unit?: string;

  @ApiProperty({ required: false })
  unitPrice?: string;

  @ApiProperty({ required: false })
  totalPrice?: string;
}

export class ProductMatchDto {
  @ApiProperty()
  scrap_title: string;

  @ApiProperty()
  product_id: string;

  @ApiProperty()
  confidence: number;
}

export class LLMInfoDto {
  @ApiProperty()
  provider: string;

  @ApiProperty()
  model: string;

  @ApiProperty()
  prompt: string;

  @ApiProperty({ required: false })
  response?: string;

  @ApiProperty({ required: false })
  prompt_tokens?: number;

  @ApiProperty({ required: false })
  response_tokens?: number;

  @ApiProperty({ required: false })
  total_tokens?: number;

  @ApiProperty({ required: false })
  temperature?: number;

  @ApiProperty({ required: false })
  response_time?: number; // em millisegundos

  @ApiProperty({ required: false })
  cost?: number; // em USD

  @ApiProperty({ required: false })
  error_details?: any;
}

export class MatchResultDto {
  @ApiProperty({ type: [ProductMatchDto] })
  match: ProductMatchDto[];

  @ApiProperty({ type: [ProductScrapDto] })
  unmatch: ProductScrapDto[];

  @ApiProperty({ type: LLMInfoDto, required: false })
  llm_info?: LLMInfoDto;
}

export class MatchRequestDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty({ type: [ProductScrapDto] })
  products_scrap: ProductScrapDto[];
}
