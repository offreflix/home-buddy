import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { StocksModule } from './stocks/stocks.module';
import { CategoriesModule } from './categories/categories.module';
import { ScrappingModule } from './scrapping/scrapping.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    StocksModule,
    CategoriesModule,
    ScrappingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
