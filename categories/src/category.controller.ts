import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Post()
  async create(@Body() body: { name: string; description?: string }) {
    // 1. Guardar la categoría en la base de datos
    const category = await this.categoryService.createCategory(body);

    // 2. Emitir el evento a Kafka
    this.kafkaClient.emit('category.created', {
      id: category._id,
      name: category.name,
      description: category.description,
    });

    return {
      message: 'Category created successfully',
      category,
    };
  }
}
