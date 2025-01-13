import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async createCategory(data: { name: string; description?: string }): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    return newCategory.save(); // Persistir en MongoDB
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }
}
