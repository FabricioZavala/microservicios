import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AggregatorController } from './features/aggregator.controller';
import { UsersController } from './users/users.controller';
import { EquipmentController } from './equipment/equipment.controller';
import { CategoriesController } from './categories/categories.controller';
import { AuthController } from './auth/auth.controller';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    HttpModule,
  ],
  controllers: [
    //ver si agregator controller es funcional sino borrarlo, pd ya lo comrpobé, no funciona borraloooo
    AggregatorController, 
    UsersController,
    EquipmentController,
    CategoriesController,
    AuthController
  ],
})
export class AppModule {}
