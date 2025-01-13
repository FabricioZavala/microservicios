import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE', // Nombre del cliente Kafka
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Dirección del broker Kafka
          },
          producer: {},
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
