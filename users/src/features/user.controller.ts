import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdateUserDto } from 'src/dtos/update-user.dto';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // CREATE
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  // READ ALL
  @Get()
  findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  // READ ONE
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  //evento para escuchar eliminaciones en equipments
  @EventPattern('equipment.deleted')
  async handleEquipmentDeleted(@Payload() message: { id: string }) {
    const equipmentId = message.id;
    // Llamamos al servicio para limpiar la referencia
    await this.userService.removeEquipmentReference(equipmentId);
  }
}
