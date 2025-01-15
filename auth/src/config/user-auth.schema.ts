import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/**
 * Indicamos la misma colección que el microservicio de users:
 *    collection: 'users'
 * Esto hará que ambos microservicios lean/escriban en la misma.
 */
@Schema({ collection: 'users' })
export class UserAuth extends Document {
  // Campos que ya existen en tu microservicio users:
  
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  fullName?: string;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ type: [String], default: [] })
  equipmentIds: string[];


  // Campos nuevos para autenticación:
  
  @Prop({ required: true })
  password: string;  // Se almacenará la contraseña hasheada (bcrypt)

  @Prop({ type: [String], default: ['user'] })
  roles: string[];  // Ej: ['admin', 'user']

  @Prop({ default: true })
  isActive: boolean;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);
