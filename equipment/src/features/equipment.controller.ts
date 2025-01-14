import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from 'src/dtos/create-equipment.dto';
import { UpdateEquipmentDto } from 'src/dtos/update-equipment.dto';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService
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
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }

  // BULK: retorna varios equipos por sus IDs
  @Post('bulk')
  getEquipmentsBulk(@Body() body: { ids: string[] }) {
    // Si no hay IDs, retornar array vacío
    return this.equipmentService.findBulkByIds(body.ids || []);
  }

   // Obtener equipos con información de categorías
   @Get('by-category/:categoryId')
   async findEquipmentsByCategory(@Param('categoryId') categoryId: string) {
     return this.equipmentService.findEquipmentsWithCategoryInfo(categoryId);
   }
}
