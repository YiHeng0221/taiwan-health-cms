/**
 * @fileoverview NestJS Application Entry Point
 * 
 * Architecture Decisions:
 * 1. Cookie parser for JWT HttpOnly cookie support
 * 2. Helmet for security headers
 * 3. CORS configured for frontend domain
 * 4. Global validation pipe for DTO validation
 * 5. Global exception filter for consistent error responses
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());
  app.use(cookieParser());

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix for API
  app.setGlobalPrefix('api');

  // Global validation pipe
  // Transforms payloads to DTO instances and validates them
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error on non-whitelisted properties
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  
  console.log(`🚀 API 伺服器運行於: http://localhost:${port}/api`);
}

bootstrap();
