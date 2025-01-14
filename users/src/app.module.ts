import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios'; // Importa el módulo Http
import { User, UserSchema } from './features/user.schema';
import { UserController } from './features/user.controller';
import { UserService } from './features/user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    HttpModule, // Agrega HttpModule aquí
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
