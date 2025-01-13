import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // Cliente Kafka
  ) {}

  async onModuleInit() {
    // Conectar el cliente Kafka
    await this.kafkaClient.connect();
  }

  @Post('create-category')
  async createCategory(@Body() category: any) {
    // Envía un objeto JSON directamente
    this.kafkaClient.emit('category.created', {
      id: category.id,
      name: category.name,
    });
    return { message: 'Category created event sent to Kafka', category };
  }
}
