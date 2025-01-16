import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserAuth } from './user-auth.schema';
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

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const createdUser = await this.userModel.create({
      ...dto,
      password: hash,
      roles: ['user'],
      isActive: true,
    });

    return { message: 'Usuario registrado con éxito', userId: createdUser._id };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('El email no está registrado o es incorrecto');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  
    // Payload básico
    const payload = { sub: user._id, roles: user.roles };
  
    // Generar un token SIN expiración
    // (simplemente no pasamos expiresIn en las opciones)
    const accessToken = this.jwtService.sign(payload);
  
    return {
      message: 'Login exitoso',
      accessToken,
      userId: user._id,
      roles: user.roles,
    };
  }
  

  async updateUser(id: string, dto: any) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      dto.password = await bcrypt.hash(dto.password, salt);
    }

    if (dto.status) {
      dto.isActive = dto.status === 'active';
    }

    const allowedFields = [
      'username',
      'email',
      'password',
      'fullName',
      'roles',
      'isActive',
      'equipmentIds',
    ];
    for (const field of allowedFields) {
      if (dto[field] !== undefined) {
        user[field] = dto[field];
      }
    }

    await user.save();
    return { message: 'Usuario actualizado con éxito' };
  }

  async getAllUsers() {
    const users = await this.userModel.find({}, '-password');
    if (!users) {
      throw new NotFoundException('No se encontraron usuarios.');
    }
    return users;
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId, '-password');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return user;
  }
}
