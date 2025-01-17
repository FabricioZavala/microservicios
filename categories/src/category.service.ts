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

  // Crear categoría
  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save();
  }

  // Leer todas las categorías
  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().sort({createdAt: -1}).exec();
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
