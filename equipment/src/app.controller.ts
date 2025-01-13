import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @EventPattern('category.created') // Escucha el evento
  handleCategoryCreated(@Payload() message: any) {
    // Log completo del mensaje recibido
    console.log('Raw event received in equipment:', message);

    // Accede explícitamente a los datos
    const data = message; // Mensaje recibido directamente

    if (data) {
      console.log('Deserialized event:', data); // Muestra el evento deserializado
    } else {
      console.error('Received event but data is undefined');
    }
  }
}
