import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // enlève les props non présentes dans le DTO
      forbidNonWhitelisted: true, // throw si props inconnues
      transform: true, // transforme le body en instance de DTO
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
