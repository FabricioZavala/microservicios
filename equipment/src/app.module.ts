import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Equipment, EquipmentSchema } from './features/equipment.schema';
import { EquipmentController } from './features/equipment.controller';
import { EquipmentService } from './features/equipment.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: Equipment.name, schema: EquipmentSchema }]),
  ],
  controllers: [AppController, EquipmentController],
  providers: [AppService, EquipmentService],
})
export class AppModule {}
