/**
 * Product Response DTO - MVC Layer: VIEW (Response Formatting)
 * Responsible for: Defining the structure of API responses
 * Contains: Type definitions for response data
 * Does NOT contain: Business logic, database operations
 */
export class ProductResponseDto {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}

