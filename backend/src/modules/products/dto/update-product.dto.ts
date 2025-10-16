import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * Update Product DTO - MVC Layer: VIEW (Request Validation)
 * Responsible for: Validating update request data (all fields optional)
 * Extends: CreateProductDto with all fields made optional
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}

