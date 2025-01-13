import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './category.schema';

@Module({
  imports: [
    // Carga variables de entorno (.env)
    ConfigModule.forRoot(),

    // Mongoose se conecta usando MONGODB_URI
    MongooseModule.forRoot(process.env.MONGODB_URI),

    // Registro del cliente Kafka para emitir eventos
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

    // Registra el schema de Category para CRUD
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  controllers: [AppController, CategoryController],
  providers: [AppService, CategoryService],
})
export class AppModule {}
