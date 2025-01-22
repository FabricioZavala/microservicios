import { Body, Controller, Get, Param, Patch, Post, Req, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from 'src/dtos/register.dto';
import { LoginDto } from 'src/dtos/login.dto';
import { get } from 'http';
import { AuthService } from '../services/auth.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AuditLogService } from '../services/audit-log.service';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly auditLogService: AuditLogService,
  ) {}

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

  @Get('users')
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Get('me')
  async getLoggedInUser(@Req() req: any) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('Token inválido o faltante.');
    }
    return this.authService.getUserById(userId);
  }

  @EventPattern('equipment.audited')
  async handleEquipmentAudited(@Payload() message: any) {
    await this.auditLogService.createLog(message);
  }

  @EventPattern('category.audited')
  async handleCategoryAudited(@Payload() message: any) {
    await this.auditLogService.createLog(message);
  }
}
