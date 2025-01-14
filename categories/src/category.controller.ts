import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Controller('categories')
export class CategoryController implements OnModuleInit {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  // Nos aseguramos de conectar el cliente Kafka
  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  // CREATE
  @Post()
  async createCategory(@Body() body: CreateCategoryDto) {
    const category = await this.categoryService.create(body);

    // Emitir evento "category.created" a Kafka
    this.kafkaClient.emit('category.created', {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      status: category.status,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }

  // READ ALL
  @Get()
  async getAllCategories() {
    return this.categoryService.findAll();
  }

  // READ ONE
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, body);
  }

  // DELETE
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    const deletedCategory = await this.categoryService.remove(id);

    // Emitir evento "category.deleted" a Kafka
    this.kafkaClient.emit('category.deleted', { id });

    return deletedCategory;
  }
}
