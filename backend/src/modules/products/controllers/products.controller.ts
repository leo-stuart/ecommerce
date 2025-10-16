import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto } from '../dto/filter-product.dto';

/**
 * Products Controller - MVC Layer: CONTROLLER
 * Responsible for: HTTP request handling, routing, response formatting
 * Contains: Route decorators, parameter extraction, service calls
 * Does NOT contain: Business logic, database operations
 * 
 * Controllers should be THIN (max 50 lines per method)
 * All business logic is delegated to ProductsService
 */
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /api/products
   * Create a new product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  /**
   * GET /api/products
   * Get all products with pagination and filters
   */
  @Get()
  async findAll(@Query() filterDto: FilterProductDto) {
    return await this.productsService.findAll(filterDto);
  }

  /**
   * GET /api/products/analytics/by-category
   * Get product count by category
   */
  @Get('analytics/by-category')
  async getCountByCategory() {
    return await this.productsService.getCountByCategory();
  }

  /**
   * GET /api/products/:id
   * Get a single product by ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  /**
   * PATCH /api/products/:id
   * Update a product
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productsService.update(+id, updateProductDto);
  }

  /**
   * DELETE /api/products/:id
   * Delete a product (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}

