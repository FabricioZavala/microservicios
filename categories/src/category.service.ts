import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async findAll(query: any): Promise<{ data: Category[]; totalCount: number }> {
    const { page = 1, limit = 10, name, description, status } = query;

    // Filtro dinámico
    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (description) filters.description = { $regex: description, $options: 'i' };
    if (status) filters.status = status;

    // Paginación
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      this.categoryModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(),
      this.categoryModel.countDocuments(filters).exec(),
    ]);

    return { data, totalCount };
  }

  // Crear categoría
  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }


  // Leer una categoría por ID
  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  // Actualizar categoría
  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  // Eliminar categoría
  async remove(id: string): Promise<Category> {
    return this.categoryModel.findByIdAndDelete(id).exec();
  }
}
