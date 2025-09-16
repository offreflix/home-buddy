import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  MatchRequestDto,
  MatchResultDto,
  ProductScrapDto,
} from './dto/match-result.dto';
import { ScrapedData } from './scrapping.service';
// import { AxiosError } from 'axios';
import { TrackingService } from '../tracking/tracking.service';

@Injectable()
export class MatcherService {
  private readonly logger = new Logger(MatcherService.name);
  private readonly matcherUrl =
    process.env.MATCHER_BASE_URL || 'http://127.0.0.1:8000';
  private readonly internalToken = process.env.INTERNAL_TOKEN || 'dev-token';

  constructor(
    private readonly httpService: HttpService,
    private readonly trackingService: TrackingService,
  ) {}

  async matchProducts(
    userId: number,
    scrapedProducts: ScrapedData[],
    operationId?: number,
  ): Promise<MatchResultDto> {
    console.log(process.env.INTERNAL_TOKEN);
    this.logger.log(
      `Iniciando matching para usuário ${userId} com ${scrapedProducts.length} produtos`,
    );
    this.logger.log(`Matcher URL: ${this.matcherUrl}`);
    this.logger.log(`Internal Token configurado: ${!!this.internalToken}`);

    try {
      const testResponse = await firstValueFrom(
        this.httpService.get(`${this.matcherUrl}/docs`, { timeout: 5000 }),
      );
      this.logger.log(`Matcher conectividade OK: ${testResponse.status}`);
    } catch (connectError) {
      this.logger.error(`Matcher não acessível: ${connectError}`);
    }

    try {
      const productsScrap: ProductScrapDto[] = scrapedProducts.map(
        (product) => ({
          title: product.title,
          code: product.code,
          quantity: product.quantity,
          unit: product.unit,
          unitPrice: product.unitPrice,
          totalPrice: product.totalPrice,
        }),
      );

      const matchRequest: MatchRequestDto = {
        user_id: userId.toString(),
        products_scrap: productsScrap,
      };

      const headers = {
        'Content-Type': 'application/json',
        'X-Service-Token': this.internalToken,
      };

      const response = await firstValueFrom(
        this.httpService.post<MatchResultDto>(
          `${this.matcherUrl}/match`,
          matchRequest,
          {
            headers,
            timeout: 60000, // 60 segundos para OpenAI responder
          },
        ),
      );

      this.logger.log(
        `Matching concluído: ${response.data.match.length} matches, ${response.data.unmatch.length} unmatches`,
      );

      if (operationId && response.data.llm_info) {
        try {
          await this.trackingService.createLLMLog({
            operationId,
            provider: response.data.llm_info.provider,
            model: response.data.llm_info.model,
            prompt: response.data.llm_info.prompt,
            response: response.data.llm_info.response,
            promptTokens: response.data.llm_info.prompt_tokens,
            responseTokens: response.data.llm_info.response_tokens,
            totalTokens: response.data.llm_info.total_tokens,
            cost: response.data.llm_info.cost,
            temperature: response.data.llm_info.temperature,
            responseTime: response.data.llm_info.response_time,
          });

          this.logger.log(
            `LLM Log salvo: ${response.data.llm_info.total_tokens} tokens, custo: $${response.data.llm_info.cost}`,
          );
        } catch (trackingError) {
          this.logger.warn('Erro ao salvar log da LLM:', trackingError);
        }
      }

      return response.data;
    } catch (error) {
      this.logger.error('Erro ao chamar serviço de matching:', error);

      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error.response as any)?.status === 401
      ) {
        throw new HttpException(
          'Token de autenticação inválido para o serviço de matching',
          500,
        );
      }

      throw new HttpException('Erro interno no serviço de matching', 500);
    }
  }
}
