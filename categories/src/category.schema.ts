import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 'active' })
  status: string; // Ejemplo: 'active', 'inactive', etc.

  // Agrega más campos según tu necesidad
}

export const CategorySchema = SchemaFactory.createForClass(Category);
