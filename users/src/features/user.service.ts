import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly httpService: HttpService,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findAll(query: any): Promise<{ data: any[]; totalCount: number }> {
    const { page = 1, limit = 10, username, email, status, roles } = query;

    const filters: any = {};

    if (username) {
        filters.username = { $regex: username, $options: 'i' }; // Búsqueda parcial y sin distinción de mayúsculas
    }
    if (query.fullName) {
      filters.fullName = { $regex: query.fullName, $options: 'i' }; // Filtro insensible a mayúsculas
    }
    if (email) {
        filters.email = { $regex: email, $options: 'i' }; // Búsqueda parcial
    }
    if (status) {
        filters.status = status; // Búsqueda exacta
    }
    if (roles) {
        filters.roles = { $in: [roles] }; // Roles deben coincidir
    }

    console.log('Filtros aplicados:', filters);

    const totalCount = await this.userModel.countDocuments(filters);
    const users = await this.userModel
        .find(filters)
        .sort({ _id: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec();

    const enrichedUsers = await Promise.all(
        users.map(async (user) => {
            const equipmentIds = user.equipmentIds || [];
            let equipments = [];

            if (equipmentIds.length > 0) {
                const { data } = await lastValueFrom(
                    this.httpService.post('http://localhost:3001/equipment/bulk', {
                        ids: equipmentIds,
                    }),
                );
                equipments = data;
            }

            return {
                ...user.toObject(),
                equipments,
            };
        }),
    );

    return { data: enrichedUsers, totalCount };
}

  

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async remove(id: string): Promise<User> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async removeEquipmentReference(equipmentId: string): Promise<void> {
    await this.userModel.updateMany(
      { equipmentIds: equipmentId },
      { $pull: { equipmentIds: equipmentId } },
    );
  }
}
