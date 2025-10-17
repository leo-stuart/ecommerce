import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Create Product DTO - MVC Layer: VIEW (Request Validation)
 * Responsible for: Validating incoming request data
 * Contains: Validation decorators, type definitions
 * Does NOT contain: Business logic, database operations
 */
export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'Laptop Dell XPS 15',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'High-performance laptop with Intel i7 processor and 16GB RAM',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 1299.99,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Available stock quantity',
    example: 10,
    minimum: 0,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Stock Keeping Unit (SKU) - must be unique',
    example: 'LAP-XPS15-001',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @ApiPropertyOptional({
    description: 'Product category',
    example: 'Electronics',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({
    description: 'Product image URL',
    example: 'https://example.com/images/laptop-xps15.jpg',
  })
  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Whether the product is active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

