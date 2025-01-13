import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  fullName?: string;

  @Prop({ default: 'active' })
  status: string; // Ejemplo: 'active', 'inactive', etc.

  // Podríamos tener un array de equipmentIds si deseamos
  @Prop({ type: [String], default: [] })
  equipmentIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
