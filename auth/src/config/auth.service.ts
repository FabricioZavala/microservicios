import { Injectable, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from './user-auth.schema';  // nuestra schema de user con campos extra
import { RegisterDto } from 'src/dtos/register.dto';
import { LoginDto } from 'src/dtos/login.dto';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserAuth.name) private userModel: Model<UserAuth>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password } = dto;

    // Verificar si el email ya existe
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const createdUser = await this.userModel.create({
      ...dto,
      password: hash,
      roles: ['user'],
      isActive: true,
    });

    // Retornar algo simple o un token si quieres
    return { message: 'Usuario registrado con éxito', userId: createdUser._id };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('El email no está registrado o es incorrecto');
    }
  
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  
    // Generar tokens
    const payload = { sub: user._id, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
  
    return {
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      userId: user._id,
      roles: user.roles,
    };
  }
  

  async updateUser(id: string, dto: any) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Si viene password, la encriptamos
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    // Convertir status en isActive, si aplica
    if (dto.status) {
      // dto.status es 'active' o 'inactive'
      dto.isActive = dto.status === 'active';
    }

    // Actualizar campos permitidos
    // (por ejemplo: username, email, password, roles, isActive, etc.)
    const allowedFields = ['username', 'email', 'password', 'fullName', 'roles', 'isActive', 'equipmentIds'];
    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        user[field] = dto[field];
      }
    }

    await user.save();
    return { message: 'Usuario actualizado con éxito' };
  }
}
