import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          producer: {},
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}
//tambien eliminar pq no se usa jijija x2