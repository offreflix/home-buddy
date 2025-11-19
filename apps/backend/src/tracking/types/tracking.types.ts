import { Prisma } from '@prisma/client';
import { ProductScrapDto } from '../../scrapping/dto/match-result.dto';
import { MatchResultDto } from '../../scrapping/dto/match-result.dto';

// Tipo para metadata de operações
export type OperationMetadata = Record<string, unknown>;

// Tipos para dados de scraping
export interface ScrapingInputData {
  url: string;
  userId?: number;
}

export interface ScrapingOutputData {
  productsCount: number;
  products: ProductScrapDto[];
}

// Tipos para dados de matching
export interface MatchingInputProducts extends Array<ProductScrapDto> {}

export interface MatchingRequest {
  user_id: string;
  products_scrap: ProductScrapDto[];
}

export type MatchingResponse = MatchResultDto;

// Tipos para erros
export interface ErrorDetails {
  message?: string;
  stack?: string;
  code?: string | number;
  [key: string]: unknown;
}

// Tipos para LLM
export interface LLMErrorDetails extends ErrorDetails {
  provider?: string;
  model?: string;
  prompt?: string;
}

// Tipos usando Prisma.JsonValue para compatibilidade com banco
export type ScrapingInputDataJson = Prisma.JsonValue;
export type ScrapingOutputDataJson = Prisma.JsonValue;
export type MatchingInputProductsJson = Prisma.JsonValue;
export type MatchingRequestJson = Prisma.JsonValue;
export type MatchingResponseJson = Prisma.JsonValue;
export type ErrorDetailsJson = Prisma.JsonValue;
export type LLMErrorDetailsJson = Prisma.JsonValue;
export type OperationMetadataJson = Prisma.JsonValue;

