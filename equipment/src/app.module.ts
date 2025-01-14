import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios'; // Importa el módulo Http
import { Equipment, EquipmentSchema } from './features/equipment.schema';
import { EquipmentController } from './features/equipment.controller';
import { EquipmentService } from './features/equipment.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: Equipment.name, schema: EquipmentSchema }]),
    HttpModule, // Añade el HttpModule aquí
  ],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class AppModule {}
