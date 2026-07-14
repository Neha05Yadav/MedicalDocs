import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// Triggering restart to load new DB connection variables
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Important for connecting from Next.js frontend
  app.setGlobalPrefix('api'); // Important so routes become /api/auth/login

  // Global validation pipe — DTOs ke decorators kaam karenge iske baad
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Extra fields automatically remove ho jayenge
      forbidNonWhitelisted: false, // Unknown fields pe error nahi aayega
      transform: true, // Request body automatically DTO type mein convert hoga
    }),
  );

  await app.listen(4000);
}
bootstrap();


