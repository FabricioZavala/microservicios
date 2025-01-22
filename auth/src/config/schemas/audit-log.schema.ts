// src/config/schemas/audit-log.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

@Schema({ collection: 'audit_logs' })
export class AuditLog extends Document {
  @Prop({ required: true })
  action: string; // Tipo de acción (ej.: "create", "update", "delete", etc.)

  @Prop({ required: true })
  entity: string; // Entidad afectada (ej.: "user", "equipment", etc.)

  @Prop()
  entityId: string; // ID de la entidad afectada

  @Prop()
  userId?: string; // ID del usuario que realizó la acción

  @Prop({ type: SchemaTypes.Mixed }) // Explicitamente definimos un objeto genérico
  details?: Record<string, any>; // Datos relevantes de la acción

  @Prop({ default: Date.now })
  timestamp: Date; // Fecha y hora del suceso
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
