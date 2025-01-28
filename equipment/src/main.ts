import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'equipment-consumer',
      },
    },
  });

  await app.listen();

  const httpApp = await NestFactory.create(AppModule);
  const configService = httpApp.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  await httpApp.listen(port);
  console.log(`Equipment microservice HTTP is running on port ${port}`);
}
bootstrap();
