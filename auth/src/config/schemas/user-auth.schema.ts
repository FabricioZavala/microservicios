import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class UserAuth extends Document {
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

  @Prop({ required: true })
  password: string;

  @Prop({ type: [String], default: ['user'] })
  roles: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const UserAuthSchema = SchemaFactory.createForClass(UserAuth);
