import { Controller, Get, Query } from '@nestjs/common';
import { ScrapedData, ScrappingService } from './scrapping.service';

@Controller('scrapping')
export class ScrappingController {
  constructor(private readonly scrappingService: ScrappingService) {}

  @Get()
  async getScrapedData(@Query('url') url: string): Promise<Array<ScrapedData>> {
    return this.scrappingService.scrapeNFC(url);
  }
}
