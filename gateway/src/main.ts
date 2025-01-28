import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendUrl = process.env.FRONTEND_URL;

  // esto son los CORS :D
  app.enableCors({
    origin: frontendUrl, // URL del frontend, cambiar se lo llego a hostear, rememberrrr poner en el env como buena practica
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  await app.listen(3005);
  console.log('Gateway is running on port 3005');
}
bootstrap();
