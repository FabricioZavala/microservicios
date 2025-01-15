import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dtos/register.dto';
import { LoginDto } from 'src/dtos/login.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Patch('update/:id')
  updateUser(
    @Param('id') userId: string,
    @Body() dto: any,
  ) {
    return this.authService.updateUser(userId, dto);
  }
}
