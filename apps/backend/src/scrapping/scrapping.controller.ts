import { Controller, Get, Query } from '@nestjs/common';
import { ScrapedResponse, ScrappingService } from './scrapping.service';
import { Public } from 'src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('scrapping')
@Controller('scrapping')
export class ScrappingController {
  constructor(private readonly scrappingService: ScrappingService) {}

  @Public()
  @Get()
  async getScrapedData(@Query('url') url: string): Promise<ScrapedResponse> {
    return this.scrappingService.scrapeNFC(url);
  }
}
