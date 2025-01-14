import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './equipment.schema';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name) private readonly equipmentModel: Model<Equipment>,
  ) {}

  // CREATE
  async create(data: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = new this.equipmentModel(data);
    return newEquipment.save();
  }

  // FIND ALL
  async findAll(): Promise<Equipment[]> {
    return this.equipmentModel.find().exec();
  }

  // FIND ONE
  async findOne(id: string): Promise<Equipment> {
    return this.equipmentModel.findById(id).exec();
  }

  // UPDATE
  async update(id: string, data: UpdateEquipmentDto): Promise<Equipment> {
    return this.equipmentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // DELETE
  async remove(id: string): Promise<Equipment> {
    return this.equipmentModel.findByIdAndDelete(id).exec();
  }

  // FIND BULK (para varios IDs a la vez)
  async findBulkByIds(ids: string[]): Promise<Equipment[]> {
    if (!ids || ids.length === 0) return [];
    return this.equipmentModel.find({ _id: { $in: ids } }).exec();
  }
}
