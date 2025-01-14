import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AggregatorController } from './features/aggregator.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Habilita el acceso global a variables de entorno
    HttpModule,
  ],
  controllers: [AggregatorController],
})
export class AppModule {}
