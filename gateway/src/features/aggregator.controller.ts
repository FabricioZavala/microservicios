import { Controller, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AggregatorController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inyectamos ConfigService
  ) {}

  @Get('users-composite/:id')
  async getUserWithEquipment(@Param('id') userId: string) {
    // URLs de los microservicios desde el .env
    const usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL');
    const equipmentServiceUrl = this.configService.get<string>('EQUIPMENT_SERVICE_URL');
    const categoriesServiceUrl = this.configService.get<string>('CATEGORIES_SERVICE_URL');

    // 1) Llamar al microservicio Users
    const { data: user } = await lastValueFrom(
      this.httpService.get(`${usersServiceUrl}/users/${userId}`),
    );
    if (!user) {
      return { message: 'User not found' };
    }

    // 2) Llamar al microservicio Equipment
    const equipmentIds = user.equipmentIds || [];
    let equipments = [];
    if (equipmentIds.length > 0) {
      const { data } = await lastValueFrom(
        this.httpService.post(`${equipmentServiceUrl}/equipment/bulk`, {
          ids: equipmentIds,
        }),
      );
      equipments = data;
    }

    // 3) Para cada equipo, llamar al microservicio Categories
    for (const eq of equipments) {
      if (eq.categoryId) {
        const { data: category } = await lastValueFrom(
          this.httpService.get(`${categoriesServiceUrl}/categories/${eq.categoryId}`),
        );
        eq.categoryInfo = category;
      }
    }

    // 4) Retornar la respuesta unificada
    return {
      ...user,
      equipments,
    };
  }
}
