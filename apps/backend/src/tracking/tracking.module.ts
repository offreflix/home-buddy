import { Module } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TrackingService],
  controllers: [TrackingController],
  exports: [TrackingService],
})
export class TrackingModule {}
