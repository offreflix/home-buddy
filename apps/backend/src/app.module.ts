import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { StocksModule } from './stocks/stocks.module';
import { CategoriesModule } from './categories/categories.module';
import { ScrappingModule } from './scrapping/scrapping.module';
import { BullBoardModule } from './bull-board.module';
import { JwtAuthGuard } from './auth/auth.guard';
import { TrackingModule } from './tracking/tracking.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProductsModule,
    StocksModule,
    CategoriesModule,
    ScrappingModule,
    BullBoardModule,
    TrackingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
