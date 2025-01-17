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
  
        const categories = data.data; // Asegúrate de acceder a la propiedad `data` del microservicio
        if (categories && categories.length > 0) {
          categoryIds = categories.map((cat: any) => cat._id);
          filters.categoryId = { $in: categoryIds };
        } else {
          console.log(`No se encontraron categorías con el nombre: ${categoryName}`);
          return { data: [], totalCount: 0 }; // Si no hay categorías coincidentes, devolver vacío
        }
      } catch (error) {
        console.error('Error al obtener categorías:', error.message);
        throw new Error('Error al buscar categorías');
      }
    }
  
    console.log('Filtros aplicados:', filters);
  
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
