import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './equipment.schema';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class EquipmentService {
  private categoriesServiceUrl: string;

  constructor(
    @InjectModel(Equipment.name) private readonly equipmentModel: Model<Equipment>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  )  {
    this.categoriesServiceUrl = this.configService.get<string>('CATEGORIES_SERVICE_URL');
  }

  async create(data: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = new this.equipmentModel(data);
    const savedEquipment = await newEquipment.save();
  
    // Emitir evento Kafka para auditoría
    this.kafkaClient.emit('equipment.audited', {
      action: 'create',
      entity: 'equipment',
      entityId: savedEquipment._id.toString(),
      details: savedEquipment.toObject(),
    });
  
    return savedEquipment;
  }

  async findAll(query: any): Promise<{ data: any[]; totalCount: number }> {
    const { page = 1, limit = 10, name, description, status, categoryName } = query;
  
    const filters: any = {};
  
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (description) filters.description = { $regex: description, $options: 'i' };
    if (status) filters.status = status;
  
    let categoryIds: string[] = [];
    if (categoryName) {
      try {
        const { data } = await lastValueFrom(
          this.httpService.get(`${this.categoriesServiceUrl}/categories`, {
            params: { name: categoryName },
          }),
        );
  
        const categories = data.data;
        if (categories && categories.length > 0) {
          categoryIds = categories.map((cat: any) => cat._id);
          filters.categoryId = { $in: categoryIds };
        } else {
          return { data: [], totalCount: 0 };
        }
      } catch (error) {
        throw new Error('Error al buscar categorías');
      }
    }
  
    const totalCount = await this.equipmentModel.countDocuments(filters);
  
    const equipments = await this.equipmentModel
      .find(filters)
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec();
  
    const enrichedEquipments = await Promise.all(
      equipments.map(async (equipment) => {
        if (equipment.categoryId) {
          const { data: categoryInfo } = await lastValueFrom(
            this.httpService.get(`${this.categoriesServiceUrl}/categories/${equipment.categoryId}`),
          );
          return {
            ...equipment.toObject(),
            categoryInfo,
          };
        }
        return equipment.toObject();
      }),
    );
  
    return { data: enrichedEquipments, totalCount };
  }

  async findOne(id: string): Promise<Equipment> {
    return this.equipmentModel.findById(id).exec();
  }

  async update(id: string, data: UpdateEquipmentDto): Promise<Equipment> {
    const oldEquipment = await this.equipmentModel.findById(id);
    if (!oldEquipment) throw new NotFoundException(`Equipo no encontrado: ${id}`);
  
    const updatedEquipment = await this.equipmentModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );
  
    // Emitir evento Kafka para auditoría
    this.kafkaClient.emit('equipment.audited', {
      action: 'update',
      entity: 'equipment',
      entityId: id,
      details: {
        old: oldEquipment.toObject(),
        new: updatedEquipment.toObject(),
      },
    });
  
    return updatedEquipment;
  }

  async remove(id: string): Promise<Equipment> {
    const removedEquipment = await this.equipmentModel.findByIdAndDelete(id);
    if (!removedEquipment) throw new NotFoundException(`Equipo no encontrado: ${id}`);
  
    // Emitir evento Kafka para auditoría
    this.kafkaClient.emit('equipment.audited', {
      action: 'delete',
      entity: 'equipment',
      entityId: id,
      details: removedEquipment.toObject(),
    });
  
    return removedEquipment;
  }

  async removeCategoryReference(categoryId: string): Promise<void> {
    await this.equipmentModel.updateMany(
      { categoryId },
      { $unset: { categoryId: "" } }
    );
  }

  async updateStatusFromEvent(
    equipmentId: string,
    status: string,
    userId?: string | null,
  ) {
    const equipment = await this.equipmentModel.findById(equipmentId);
    if (!equipment) {
      throw new NotFoundException(`Equipo no encontrado: ${equipmentId}`);
    }

    equipment.status = status;
    equipment.userId = userId ?? null;

    await equipment.save();
    return equipment;
  }

  async findBulkByIds(ids: string[]): Promise<Equipment[]> {
    if (!ids || ids.length === 0) return [];
    return this.equipmentModel.find({ _id: { $in: ids } }).exec();
  }

  async findEquipmentsWithCategoryInfo(categoryId: string): Promise<any[]> {
    const equipments = await this.equipmentModel.find({ categoryId }).exec();

    const { data: categoryInfo } = await lastValueFrom(
      this.httpService.get(`http://localhost:3000/categories/${categoryId}`),
    );

    return equipments.map(equipment => ({
      ...equipment.toObject(),
      categoryInfo,
    }));
  }
}
