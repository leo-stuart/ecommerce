import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEnum,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ProductSortField {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  CREATED_AT = 'createdAt',
}

/**
 * Filter Product DTO - MVC Layer: VIEW (Query Validation)
 * Responsible for: Validating query parameters for filtering and sorting
 * Extends: PaginationDto for pagination support
 */
export class FilterProductDto extends PaginationDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxPrice?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @IsEnum(ProductSortField)
  @IsOptional()
  sortBy?: ProductSortField;

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder;
}

