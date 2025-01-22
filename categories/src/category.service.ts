import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Kafka } from 'kafkajs';
import { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,  ) {}

  async findAll(query: any): Promise<{ data: Category[]; totalCount: number }> {
    const { page = 1, limit = 10, name, description, status } = query;

    const filters: any = {};
    if (name) filters.name = { $regex: name, $options: 'i' };
    if (description) filters.description = { $regex: description, $options: 'i' };
    if (status) filters.status = status;

    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      this.categoryModel.find(filters).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).exec(),
      this.categoryModel.countDocuments(filters).exec(),
    ]);

    return { data, totalCount };
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(data);
    const savedCategory = await newCategory.save();

    // Emitir evento de auditoría
    this.kafkaClient.emit('category.audited', {
      action: 'create',
      entity: 'category',
      entityId: savedCategory._id.toString(),
      details: savedCategory.toObject(),
    });

    return savedCategory;
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, data: UpdateCategoryDto): Promise<Category> {
    const oldCategory = await this.categoryModel.findById(id);
    if (!oldCategory) {
      throw new NotFoundException(`Categoría no encontrada: ${id}`);
    }

    const updatedCategory = await this.categoryModel.findByIdAndUpdate(id, data, { new: true }).exec();

    // Emitir evento de auditoría
    this.kafkaClient.emit('category.audited', {
      action: 'update',
      entity: 'category',
      entityId: id,
      details: {
        old: oldCategory.toObject(),
        new: updatedCategory.toObject(),
      },
    });

    return updatedCategory;
  }

  async remove(id: string): Promise<Category> {
    const removedCategory = await this.categoryModel.findByIdAndDelete(id);
    if (!removedCategory) {
      throw new NotFoundException(`Categoría no encontrada: ${id}`);
    }

    // Emitir evento de auditoría
    this.kafkaClient.emit('category.audited', {
      action: 'delete',
      entity: 'category',
      entityId: id,
      details: removedCategory.toObject(),
    });

    return removedCategory;
  }
}
