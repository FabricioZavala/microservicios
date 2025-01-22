import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const appKafka = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'auth-consumer',
      },
    },
  });
  appKafka.listen();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.AUTH_PORT || 3007);
  console.log(`Auth microservice HTTP running on port ${process.env.AUTH_PORT || 3004}`);
}
bootstrap();
