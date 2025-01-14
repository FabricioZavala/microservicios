import { Controller, Get, Param } from '@nestjs/common';
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

  @Get(':id')
  async getUser(@Param('id') userId: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.usersServiceUrl}/users/${userId}`),
    );
    return data;
  }
}
