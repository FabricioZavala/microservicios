// src/audit-log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from '../schemas/audit-log.schema';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectModel(AuditLog.name) private readonly auditLogModel: Model<AuditLog>,
  ) {}

  async createLog(data: Partial<AuditLog>): Promise<AuditLog> {
    const newLog = new this.auditLogModel(data);
    return newLog.save();
  }

  async findAll(query: any): Promise<{ data: AuditLog[]; totalCount: number }> {
    const {
      page = 1,
      limit = 10,
      entity,
      action,
      username,
      equipmentName,
      categoryName,
      startDate,
      endDate,
    } = query;
  
    const filters: any = {};
  
    if (entity) filters.entity = entity;
    if (action) filters.action = action;
  
    if (startDate || endDate) {
      filters.timestamp = {};
      if (startDate) filters.timestamp.$gte = new Date(startDate);
      if (endDate) filters.timestamp.$lte = new Date(endDate);
    }
  
    if (username) {
      filters['details.username.new'] = { $regex: username, $options: 'i' };
    }
  
    if (equipmentName) {
      filters['details.equipmentName'] = { $regex: equipmentName, $options: 'i' };
    }
  
    if (categoryName) {
      filters['details.categoryName'] = { $regex: categoryName, $options: 'i' };
    }
  
    const totalCount = await this.auditLogModel.countDocuments(filters);
  
    const data = await this.auditLogModel
      .find(filters)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();
  
    return { data, totalCount };
  }
  
}
