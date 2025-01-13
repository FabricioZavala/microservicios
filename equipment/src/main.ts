import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // Creamos un microservicio Kafka
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'equipment-consumer', // nombre único
      },
    },
  });

  await app.listen();
  console.log('Equipment microservice is running');

  // Iniciamos también una app HTTP normal si queremos exponer un CRUD en REST
  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  await httpApp.listen(port);
  console.log(`Equipment microservice HTTP is running on port ${port}`);
}
bootstrap();
