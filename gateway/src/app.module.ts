import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AggregatorController } from './features/aggregator.controller';
import { UsersController } from './users/users.controller';
import { EquipmentController } from './equipment/equipment.controller';
import { CategoriesController } from './categories/categories.controller';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Para leer variables de entorno de .env
    HttpModule, // Permite usar HttpService
  ],
  controllers: [
    //ver si agregator controller es funcional sino borrarlo
    AggregatorController, 
    UsersController,
    EquipmentController,
    CategoriesController,
  ],
})
export class AppModule {}
