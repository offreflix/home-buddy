import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { ScrappingController } from './scrapping.controller';
import { ScrappingService } from './scrapping.service';
import { ScrapingQueueProcessor } from './scrapping-queue.processor';
import { ScrapingQueueService } from './scrapping-queue.service';
import { MatcherService } from './matcher.service';
import { TrackingModule } from '../tracking/tracking.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'scraping',
    }),
    HttpModule,
    TrackingModule,
  ],
  controllers: [ScrappingController],
  providers: [
    ScrappingService,
    ScrapingQueueProcessor,
    ScrapingQueueService,
    MatcherService,
  ],
  exports: [ScrappingService, ScrapingQueueService, MatcherService],
})
export class ScrappingModule {}
