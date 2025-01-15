import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { UserAuth, UserAuthSchema } from './config/user-auth.schema';
import { AuthController } from './config/auth.controller';
import { AuthService } from './config/auth.service';


@Module({
  imports: [
    ConfigModule.forRoot(),
    // Conexión a la MISMA base de datos que users
    MongooseModule.forRoot(process.env.MONGODB_URI),
    // Usar la misma colección 'users'
    MongooseModule.forFeature([{ name: UserAuth.name, schema: UserAuthSchema }]),

    // Kafka (opcional, si usas microservicios)
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),

    // JWT
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
