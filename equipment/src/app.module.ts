import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Equipment, EquipmentSchema } from './features/equipment.schema';
import { EquipmentController } from './features/equipment.controller';
import { EquipmentService } from './features/equipment.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: Equipment.name, schema: EquipmentSchema }]),
    HttpModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Tu broker Kafka
          },
          consumer: {
            groupId: 'equipment-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class AppModule {}
