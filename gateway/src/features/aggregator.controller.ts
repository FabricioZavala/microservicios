import { Controller, Get, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AggregatorController {
  constructor(private readonly httpService: HttpService) {}

  // Ejemplo: Obtener un User con sus Equipment y la info de Category de cada equipo
  @Get('users-composite/:id')
  async getUserWithEquipment(@Param('id') userId: string) {
    // 1) Llamar al microservicio Users (puerto 3002) para obtener el usuario
    const { data: user } = await lastValueFrom(
      this.httpService.get(`http://localhost:3002/users/${userId}`),
    );
    if (!user) {
      return { message: 'User not found' };
    }

    // 2) Con user.equipmentIds, llamar al microservicio Equipment (puerto 3001)
    const equipmentIds = user.equipmentIds || [];
    let equipments = [];
    if (equipmentIds.length > 0) {
      // Hacemos un POST a /equipment/bulk enviando { ids: [...] }
      const { data } = await lastValueFrom(
        this.httpService.post(`http://localhost:3001/equipment/bulk`, {
          ids: equipmentIds,
        }),
      );
      equipments = data;
    }

    // 3) Para cada equipo, obtener su categoría desde categories (puerto 3000)
    for (const eq of equipments) {
      if (eq.categoryId) {
        const { data: category } = await lastValueFrom(
          this.httpService.get(`http://localhost:3000/categories/${eq.categoryId}`),
        );
        eq.categoryInfo = category; // Adjuntamos los datos de la categoría
      }
    }

    // 4) Retornar toda la data unificada
    return {
      ...user,
      equipments,
    };
  }
}
