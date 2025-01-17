import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
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

  // Obtener todos los equipos
  @Get()
  async getAllEquipments(@Query() query: any) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.equipmentServiceUrl}/equipment`, {
        params: query,
      }),
    );
    return data;
  }

  // Obtener un equipo por ID
  @Get(':id')
  async getEquipment(@Param('id') equipmentId: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.equipmentServiceUrl}/equipment/${equipmentId}`),
    );
    return data;
  }

  // Crear un equipo
  @Post()
  async createEquipment(@Body() createEquipmentDto: any) {
    const { data } = await lastValueFrom(
      this.httpService.post(`${this.equipmentServiceUrl}/equipment`, createEquipmentDto),
    );
    return data;
  }

  // Actualizar un equipo
  @Patch(':id')
  async updateEquipment(
    @Param('id') equipmentId: string,
    @Body() updateEquipmentDto: any,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.patch(`${this.equipmentServiceUrl}/equipment/${equipmentId}`, updateEquipmentDto),
    );
    return data;
  }

  // Eliminar un equipo
  @Delete(':id')
  async deleteEquipment(@Param('id') equipmentId: string) {
    const { data } = await lastValueFrom(
      this.httpService.delete(`${this.equipmentServiceUrl}/equipment/${equipmentId}`),
    );
    return data;
  }
}
