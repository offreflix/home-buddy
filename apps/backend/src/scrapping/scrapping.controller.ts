import { Controller, Get, Query } from '@nestjs/common';
import { ScrapedResponse, ScrappingService } from './scrapping.service';

@Controller('scrapping')
export class ScrappingController {
  constructor(private readonly scrappingService: ScrappingService) {}

  @Get()
  async getScrapedData(@Query('url') url: string): Promise<ScrapedResponse> {
    return this.scrappingService.scrapeNFC(url);
  }
}
