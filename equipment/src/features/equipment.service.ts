import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment } from './equipment.schema';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EquipmentService {
  private categoriesServiceUrl: string;

  constructor(
    @InjectModel(Equipment.name) private readonly equipmentModel: Model<Equipment>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  )  {
    this.categoriesServiceUrl = this.configService.get<string>('CATEGORIES_SERVICE_URL');
  }

  // CREATE
  async create(data: CreateEquipmentDto): Promise<Equipment> {
    const newEquipment = new this.equipmentModel(data);
    return newEquipment.save();
  }

  async findAll(): Promise<any[]> {
    const equipments = await this.equipmentModel.find().sort({_id: -1}).exec();

    const enrichedEquipments = await Promise.all(
      equipments.map(async equipment => {
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

    return enrichedEquipments;
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
  // DELETE un equipo por su ID
async remove(id: string): Promise<Equipment> {
  return this.equipmentModel.findByIdAndDelete(id).exec();
}
//elimina si elimina una categoria, es decir limpieza de categoría cuando se emite category.deleted
  async removeCategoryReference(categoryId: string): Promise<void> {
    await this.equipmentModel.updateMany(
      { categoryId },
      { $unset: { categoryId: "" } } // Limpia el campo categoryId
    );
  }
  

  // FIND BULK (para varios IDs a la vez)
  async findBulkByIds(ids: string[]): Promise<Equipment[]> {
    if (!ids || ids.length === 0) return [];
    return this.equipmentModel.find({ _id: { $in: ids } }).exec();
  }

  async findEquipmentsWithCategoryInfo(categoryId: string): Promise<any[]> {
    // Buscar los equipos con la categoría específica
    const equipments = await this.equipmentModel.find({ categoryId }).exec();

    // Obtener información de la categoría del microservicio Categories
    const { data: categoryInfo } = await lastValueFrom(
      this.httpService.get(`http://localhost:3000/categories/${categoryId}`),
    );

    // Enriquecer cada equipo con la información de la categoría
    return equipments.map(equipment => ({
      ...equipment.toObject(),
      categoryInfo,
    }));
  }
}
