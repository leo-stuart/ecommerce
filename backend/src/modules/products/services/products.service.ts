import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, fn, col } from 'sequelize';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto, SortOrder } from '../dto/filter-product.dto';
import { PaginatedResponse, PaginationMeta } from '../../../common/dto/pagination.dto';

/**
 * Products Service - Business Logic Layer
 * Responsible for: All business logic, calculations, validations
 * Contains: CRUD operations, filtering, pagination, complex queries
 * Does NOT contain: HTTP handling, request/response formatting
 * 
 * This is where ALL business logic lives, keeping controllers thin
 */
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  /**
   * Create a new product
   * Business logic: Validate SKU uniqueness, set default values
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // Business validation: Check if SKU already exists
    if (createProductDto.sku) {
      const existingProduct = await this.productModel.findOne({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU '${createProductDto.sku}' already exists`,
        );
      }
    }

    // Create product
    const product = await this.productModel.create({
      ...createProductDto,
    });

    return product;
  }

  /**
   * Find all products with pagination, filtering, and sorting
   * Business logic: Apply filters, pagination, and sorting
   */
  async findAll(
    filterDto: FilterProductDto,
  ): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'createdAt',
      sortOrder = SortOrder.DESC,
    } = filterDto;

    // Build where clause for filtering
    const whereClause: any = {
      isActive: true, // Only show active products by default
    };

    // Search filter (name or description)
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { sku: { [Op.like]: `%${search}%` } },
      ];
    }

    // Category filter
    if (category) {
      whereClause.category = category;
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price[Op.gte] = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.price[Op.lte] = maxPrice;
      }
    }

    // Stock filter
    if (inStock !== undefined) {
      whereClause.stock = inStock ? { [Op.gt]: 0 } : 0;
    }

    // Calculate offset
    const offset = (page - 1) * limit;

    // Execute query with pagination
    const { rows: products, count: total } =
      await this.productModel.findAndCountAll({
        where: whereClause,
        limit,
        offset,
        order: [[sortBy, sortOrder]],
      });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const meta: PaginationMeta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return {
      data: products,
      meta,
    };
  }

  /**
   * Find one product by ID
   * Business logic: Validate existence
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id);

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Update a product
   * Business logic: Validate existence, check SKU uniqueness
   */
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);

    // Business validation: Check if new SKU already exists
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productModel.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Product with SKU '${updateProductDto.sku}' already exists`,
        );
      }
    }

    // Update product
    await product.update(updateProductDto);

    return product;
  }

  /**
   * Remove a product (soft delete)
   * Business logic: Validate existence, check if can be deleted
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    // Business rule: Could check if product is in orders here
    // For now, we'll just soft delete
    await product.destroy();
  }

  /**
   * Get product count by category (analytics)
   * Business logic: Group by category and count
   */
  async getCountByCategory(): Promise<{ category: string; count: number }[]> {
    const results = await this.productModel.findAll({
      attributes: [
        'category',
        [fn('COUNT', col('id')), 'count'],
      ],
      where: { isActive: true },
      group: ['category'],
    });

    return results.map((result: any) => ({
      category: result.category || 'Uncategorized',
      count: parseInt(result.get('count') as string, 10),
    }));
  }
}

