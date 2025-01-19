import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EquipmentService } from './features/equipment.service';

@Controller()
export class AppController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @EventPattern('category.created')
  async handleCategoryCreated(@Payload() message: any) {
    // console.log('Equipment microservice received category.created:', message);

    // Ejemplo: crear un equipo inicial asociado a la nueva categoría
    // if (message?.id) {
    //   await this.equipmentService.create({
    //     name: `Equipment for ${message.name}`,
    //     description: `Auto-created equipment linked to category: ${message.name}`,
    //     status: 'available',
    //     categoryId: message.id,
    //   });
    //   console.log('Auto-created equipment for new category');
    // }
  }
}
