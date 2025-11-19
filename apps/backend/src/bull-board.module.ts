import { Module, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { BullModule } from '@nestjs/bull';
import { Queue } from 'bull';
import { HttpAdapterHost } from '@nestjs/core';
import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [BullModule.registerQueue({ name: 'scraping' })],
})
export class BullBoardModule implements OnModuleInit {
  constructor(
    @InjectQueue('scraping') private readonly scrapingQueue: Queue,
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  onModuleInit() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    createBullBoard({
      queues: [new BullAdapter(this.scrapingQueue)],
      serverAdapter,
    });

    const app = this.adapterHost.httpAdapter.getInstance();
    app.use('/queues', serverAdapter.getRouter());
  }
}
