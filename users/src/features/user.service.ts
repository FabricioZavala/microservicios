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
    private readonly httpService: HttpService
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  async findAll(): Promise<any[]> {
    const users = await this.userModel.find().exec();

    const enrichedUsers = await Promise.all(
      users.map(async user => {
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

    return enrichedUsers;
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
}
