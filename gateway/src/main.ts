import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // esto son los CORS :D
  app.enableCors({
    origin: 'http://localhost:4200', // URL del frontend, cambiar se lo llego a hostear, rememberrrr poner en el env como buena practica
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // para cookies o autenticaciones 
  });

  await app.listen(3005);
  console.log('Gateway is running on port 3005');
}
bootstrap();
