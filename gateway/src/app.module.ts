import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
// import { AggregatorController } from './features/aggregator.controller';
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
    UsersController,
    EquipmentController,
    CategoriesController,
    AuthController
  ],
})
export class AppModule {}
