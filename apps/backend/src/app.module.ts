import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { StocksModule } from './stocks/stocks.module';
import { CategoriesModule } from './categories/categories.module';
import { ScrappingModule } from './scrapping/scrapping.module';
import { JwtAuthGuard } from './auth/auth.guard';
import { RecipesModule } from './recipes/recipes.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    StocksModule,
    CategoriesModule,
    ScrappingModule,
    RecipesModule,
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
