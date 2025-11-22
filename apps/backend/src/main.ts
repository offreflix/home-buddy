import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:1598',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Cache-Control',
      'X-Requested-With',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Home Buddy API')
    .setDescription('API da aplicação Home Buddy')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const logger = new Logger('NestApplication');

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    logger.log(`🚀 Server is running on http://localhost:${port}`);
    logger.log(`📂 Environment: ${process.env.NODE_ENV ?? 'development'}`);
  });
}

bootstrap();
