// import { Controller, Get, Param } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { ConfigService } from '@nestjs/config';
// import { lastValueFrom } from 'rxjs';

// @Controller('aggregator')
// export class AggregatorController {
//   constructor(
//     private readonly httpService: HttpService,
//     private readonly configService: ConfigService,
//   ) {}
// //borrae esto
//   @Get('users-composite/:id')
//   async getUserWithEquipment(@Param('id') userId: string) {
//     // Leer URLs de microservicios desde .env
//     const usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL');
//     const equipmentServiceUrl = this.configService.get<string>('EQUIPMENT_SERVICE_URL');
//     const categoriesServiceUrl = this.configService.get<string>('CATEGORIES_SERVICE_URL');

//     // 1) Obtener User por ID
//     const { data: user } = await lastValueFrom(
//       this.httpService.get(`${usersServiceUrl}/users/${userId}`),
//     );
//     if (!user) {
//       return { message: 'User not found' };
//     }

//     // 2) Obtener los equipos del usuario (bulk)
//     let equipments = [];
//     if (user.equipmentIds && user.equipmentIds.length > 0) {
//       const { data } = await lastValueFrom(
//         this.httpService.post(`${equipmentServiceUrl}/equipment/bulk`, {
//           ids: user.equipmentIds,
//         }),
//       );
//       equipments = data;
//     }

//     // 3) Para cada equipo, obtener su categoría
//     for (const eq of equipments) {
//       if (eq.categoryId) {
//         const { data: category } = await lastValueFrom(
//           this.httpService.get(`${categoriesServiceUrl}/categories/${eq.categoryId}`),
//         );
//         eq.categoryInfo = category;
//       }
//     }

//     // 4) Devolver la respuesta compuesta
//     return {
//       ...user,
//       equipments,
//     };
//   }
// }

// //no uso esto, eliminarrrrrrrr 