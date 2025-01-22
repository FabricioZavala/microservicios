import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './category.schema';
import { SharedModule } from './shared.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    SharedModule, // Importa el módulo compartido
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}

//eliminar pq no se usa jijija