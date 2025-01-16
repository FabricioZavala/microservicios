// auth.controller.ts (en el gateway)
import { Controller, Post, Body, Patch, Param, HttpException, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller('auth-gateway')
export class AuthController {
  private authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get<string>('AUTH_SERVICE_URL');
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    const { data } = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/signup`, registerDto),
    );
    return data;
  }

  @Post('login')
  async login(@Body() loginDto: any) {
    try {
      const { data } = await lastValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, loginDto),
      );
      return data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new HttpException(
          'Credenciales incorrectas.',
          401,
        );
      }
      throw new HttpException('Error en el servidor. Intenta nuevamente.', 500);
    }
  }

  @Patch('update/:id')
  async update(@Param('id') userId: string, @Body() updateDto: any) {
    const { data } = await lastValueFrom(
      this.httpService.patch(
        `${this.authServiceUrl}/auth/update/${userId}`,
        updateDto,
      ),
    );
    return data;
  }

  @Get('users')
  async getAllUsers() {
    try {
      const { data } = await lastValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/users`),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        'Error al obtener usuarios desde el microservicio.',
        error.response?.status || 500,
      );
    }
  }
}
