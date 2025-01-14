import { Controller, Get, Post, Patch, Delete, Param, Body, Inject } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka, // Cliente Kafka
  ) {}

  // CREATE
  @Post()
  create(@Body() body: CreateEquipmentDto) {
    return this.equipmentService.create(body);
  }

  // READ ALL
  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateEquipmentDto) {
    return this.equipmentService.update(id, body);
  }

  // DELETE
  @Delete(':id')
async remove(@Param('id') id: string) {
  const deletedEquipment = await this.equipmentService.remove(id);

  // Emitimos el evento "equipment.deleted"
  this.kafkaClient.emit('equipment.deleted', { id });

  return deletedEquipment;
}


  // Evento para eliminar si se elimina una categoría
  @EventPattern('category.deleted')
  async handleCategoryDeleted(@Payload() message: { id: string }) {
    const categoryId = message.id;
    await this.equipmentService.removeCategoryReference(categoryId);
  }

  // BULK: retorna varios equipos por sus IDs
  @Post('bulk')
  getEquipmentsBulk(@Body() body: { ids: string[] }) {
    return this.equipmentService.findBulkByIds(body.ids || []);
  }

  // Obtener equipos con información de categorías
  @Get('by-category/:categoryId')
  async findEquipmentsByCategory(@Param('categoryId') categoryId: string) {
    return this.equipmentService.findEquipmentsWithCategoryInfo(categoryId);
  }
}
