import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Equipment extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 'available' })
  status: string; // Ejemplo: 'available', 'in-use', etc.

  @Prop()
  categoryId?: string; // Referencia a la categoría (relación uno-a-muchos)

  @Prop()
  userId?: string; // Referencia al usuario que tiene este equipo

  // Agrega más campos según tu necesidad
}

export const EquipmentSchema = SchemaFactory.createForClass(Equipment);
