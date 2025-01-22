import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Equipment extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 'available' })
  status: string;

  @Prop()
  categoryId?: string;

  @Prop()
  userId?: string;
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
