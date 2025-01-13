import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Dirección del broker Kafka
      },
      consumer: {
        groupId: 'equipment-consumer', // Grupo de consumidores único
      },
    },
  });

  await app.listen();
  console.log('Equipment microservice is running');
}

bootstrap();
