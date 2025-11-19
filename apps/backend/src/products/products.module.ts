import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from 'src/prisma.service';
import { StocksService } from 'src/stocks/stocks.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, StocksService],
})
export class ProductsModule {}
