import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Controller('categories-gateway') // Base route
export class CategoriesController {
  private categoriesServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.categoriesServiceUrl = this.configService.get<string>('CATEGORIES_SERVICE_URL');
  }

  // Obtener todas las categorías
  @Get()
  async getAllCategories() {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.categoriesServiceUrl}/categories`),
    );
    return data;
  }

  // Obtener una categoría por ID
  @Get(':id')
  async getCategoryById(@Param('id') categoryId: string) {
    const { data } = await lastValueFrom(
      this.httpService.get(`${this.categoriesServiceUrl}/categories/${categoryId}`),
    );
    return data;
  }

  // Crear una nueva categoría
  @Post()
  async createCategory(@Body() createCategoryDto: any) {
    const { data } = await lastValueFrom(
      this.httpService.post(`${this.categoriesServiceUrl}/categories`, createCategoryDto),
    );
    return data;
  }

  // Actualizar una categoría existente
  @Patch(':id')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() updateCategoryDto: any,
  ) {
    const { data } = await lastValueFrom(
      this.httpService.patch(`${this.categoriesServiceUrl}/categories/${categoryId}`, updateCategoryDto),
    );
    return data;
  }

  // Eliminar una categoría
  @Delete(':id')
  async deleteCategory(@Param('id') categoryId: string) {
    const { data } = await lastValueFrom(
      this.httpService.delete(`${this.categoriesServiceUrl}/categories/${categoryId}`),
    );
    return data;
  }
}
