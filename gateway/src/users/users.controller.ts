import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller('users-gateway')
export class UsersController {
  private usersServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.usersServiceUrl = this.configService.get<string>('USERS_SERVICE_URL');
  }

  @Get()
async getAllUsers(@Query() query: any) {
    const { data } = await lastValueFrom(
        this.httpService.get(`${this.usersServiceUrl}/users`, {
            params: query,
        }),
    );
    return data;
}


  // Obtener un usuario por ID
  @Get(':id')
  async getUser(@Param('id') userId: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.usersServiceUrl}/users/${userId}`),
    );
    return data;
  }

  // Crear un usuario
  @Post()
  async createUser(@Body() createUserDto: any) {
    const { data } = await lastValueFrom(
      this.httpService.post(`${this.usersServiceUrl}/users`, createUserDto),
    );
    return data;
  }

  // Actualizar un usuario
  @Patch(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: any,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.patch(`${this.usersServiceUrl}/users/${userId}`, updateUserDto),
    );
    return data;
  }

  // Eliminar un usuario
  @Delete(':id')
  async deleteUser(@Param('id') userId: string) {
    const { data } = await lastValueFrom(
      this.httpService.delete(`${this.usersServiceUrl}/users/${userId}`),
    );
    return data;
  }
}
