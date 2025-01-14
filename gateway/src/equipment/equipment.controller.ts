import { Controller, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller('equipment-gateway')
export class EquipmentController {
  private equipmentServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.equipmentServiceUrl = this.configService.get<string>('EQUIPMENT_SERVICE_URL');
  }

  @Get(':id')
  async getEquipment(@Param('id') equipmentId: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.equipmentServiceUrl}/equipment/${equipmentId}`),
    );
    return data;
  }
}
