import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
  IsOptional,
  MaxLength,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Order Item DTO for creating orders
 */
export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    description: 'Quantity of product',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

/**
 * Create Order DTO - MVC Layer: VIEW (Request Validation)
 * Validates incoming data for creating new orders
 */
export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer name',
    example: 'John Doe',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  customerName: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    maxLength: 200,
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(200)
  customerEmail: string;

  @ApiProperty({
    description: 'Array of order items (products and quantities)',
    type: [CreateOrderItemDto],
    example: [
      { productId: 1, quantity: 2 },
      { productId: 3, quantity: 1 },
    ],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Order must contain at least one product' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Order notes or special instructions',
    example: 'Please deliver before 5 PM',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}

