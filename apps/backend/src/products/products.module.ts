import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { StocksService } from 'src/stocks/stocks.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, StocksService],
})
export class ProductsModule {}
