import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AggregatorController } from './features/aggregator.controller';


@Module({
  imports: [HttpModule],
  controllers: [AggregatorController],
})
export class AppModule {}
