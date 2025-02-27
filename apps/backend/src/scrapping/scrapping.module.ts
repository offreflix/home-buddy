import { Module } from '@nestjs/common';
import { ScrappingController } from './scrapping.controller';
import { ScrappingService } from './scrapping.service';

@Module({
  controllers: [ScrappingController],
  providers: [ScrappingService],
})
export class ScrappingModule {}
