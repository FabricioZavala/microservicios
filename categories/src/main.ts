import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Crea la aplicación HTTP normal (no microservice)
  const app = await NestFactory.create(AppModule);

  // Obtiene el puerto desde el .env
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port);
  console.log(`Categories microservice is running on port ${port}`);
}
bootstrap();
