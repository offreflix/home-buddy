import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());

  const logger = new Logger('NestApplication');

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    logger.log(`🚀 Server is running on http://localhost:${port}`);
    logger.log(`📂 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

bootstrap();
