import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Puerto por defecto 3000, o el que definas en .env
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);
  console.log(`Categories microservice running on port ${port}`);
}
bootstrap();
