import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Inject,
  Query,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Post()
  create(@Body() body: CreateEquipmentDto) {
    return this.equipmentService.create(body);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.equipmentService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateEquipmentDto) {
    return this.equipmentService.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedEquipment = await this.equipmentService.remove(id);

    this.kafkaClient.emit('equipment.deleted', { id });

    return deletedEquipment;
  }

  @EventPattern('category.deleted')
  async handleCategoryDeleted(@Payload() message: { id: string }) {
    const categoryId = message.id;
    await this.equipmentService.removeCategoryReference(categoryId);
  }

  @EventPattern('equipment.statusUpdated')
  async handleEquipmentStatusUpdated(@Payload() message: any) {
    const { equipmentId, status, userId } = message;
    await this.equipmentService.updateStatusFromEvent(
      equipmentId,
      status,
      userId,
    );
  }

  @Post('bulk')
  getEquipmentsBulk(@Body() body: { ids: string[] }) {
    return this.equipmentService.findBulkByIds(body.ids || []);
  }

  @Get('by-category/:categoryId')
  async findEquipmentsByCategory(@Param('categoryId') categoryId: string) {
    return this.equipmentService.findEquipmentsWithCategoryInfo(categoryId);
  }
}
