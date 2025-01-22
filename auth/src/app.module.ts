import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { JwtMiddleware } from './middleware/jwt.middleware';
import { UserAuth, UserAuthSchema } from './config/schemas/user-auth.schema';
import { AuthController } from './config/controllers/auth.controller';
import { AuthService } from './config/services/auth.service';
import { AuditLog, AuditLogSchema } from './config/schemas/audit-log.schema';
import { AuditLogService } from './config/services/audit-log.service';
import { AuditLogController } from './config/controllers/audit-log.controller'; // Importa el controlador

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([{ name: UserAuth.name, schema: UserAuthSchema }]),
    MongooseModule.forFeature([{ name: AuditLog.name, schema: AuditLogSchema }]),
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
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
    }),
  ],
  controllers: [AuthController, AuditLogController],
  providers: [AuthService, AuditLogService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('auth/me');
  }
}
