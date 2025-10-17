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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
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
@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * POST /api/products
   * Create a new product
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with name, description, price, stock, category, and SKU',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          name: 'Laptop Dell XPS 15',
          description: 'High-performance laptop',
          price: 1299.99,
          stock: 10,
          category: 'Electronics',
          sku: 'LAP-XPS15-001',
          isActive: true,
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Product with SKU already exists' })
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productsService.create(createProductDto);
  }

  /**
   * GET /api/products
   * Get all products with pagination and filters
   */
  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieves paginated list of products with optional filters for search, category, price range, and stock status',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, example: 'laptop' })
  @ApiQuery({ name: 'category', required: false, type: String, example: 'Electronics' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 0 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 5000 })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean, example: true })
  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            name: 'Laptop Dell XPS 15',
            description: 'High-performance laptop',
            price: 1299.99,
            stock: 10,
            category: 'Electronics',
            sku: 'LAP-XPS15-001',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5,
        },
      },
    },
  })
  async findAll(@Query() filterDto: FilterProductDto) {
    return await this.productsService.findAll(filterDto);
  }

  /**
   * GET /api/products/analytics/by-category
   * Get product count by category
   */
  @Get('analytics/by-category')
  @ApiOperation({
    summary: 'Get product count by category',
    description: 'Returns aggregated count of products grouped by category',
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          { category: 'Electronics', count: 25 },
          { category: 'Books', count: 15 },
          { category: 'Clothing', count: 30 },
        ],
      },
    },
  })
  async getCountByCategory() {
    return await this.productsService.getCountByCategory();
  }

  /**
   * GET /api/products/:id
   * Get a single product by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieves a single product by its unique identifier',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Product ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          name: 'Laptop Dell XPS 15',
          description: 'High-performance laptop',
          price: 1299.99,
          stock: 10,
          category: 'Electronics',
          sku: 'LAP-XPS15-001',
          isActive: true,
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: string) {
    return await this.productsService.findOne(+id);
  }

  /**
   * PATCH /api/products/:id
   * Update a product
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update product',
    description: 'Updates an existing product. All fields are optional.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          name: 'Laptop Dell XPS 15 (Updated)',
          description: 'High-performance laptop with new features',
          price: 1399.99,
          stock: 8,
          category: 'Electronics',
          sku: 'LAP-XPS15-001',
          isActive: true,
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 409, description: 'SKU already exists' })
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
  @ApiOperation({
    summary: 'Delete product',
    description: 'Soft deletes a product by setting isActive to false',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Product ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: string) {
    await this.productsService.remove(+id);
  }
}

