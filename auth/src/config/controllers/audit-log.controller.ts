import { Controller, Get, Query } from '@nestjs/common';
import { AuditLogService } from '../services/audit-log.service';

@Controller('audit-logs')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  async getAllLogs(@Query() query: any) {
    return this.auditLogService.findAll(query);
  }
}
