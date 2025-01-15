// auth.controller.ts (en el gateway)
import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
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
    const { data } = await lastValueFrom(
      this.httpService.post(`${this.authServiceUrl}/auth/login`, loginDto),
    );
    return data;
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
}
