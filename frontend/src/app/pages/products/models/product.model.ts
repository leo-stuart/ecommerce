/**
 * Product Model
 * Represents the structure of a product entity from the backend
 */
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Create Product DTO
 * Data required to create a new product
 */
export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Update Product DTO
 * Data that can be updated for a product
 */
export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Product Filter
 * Query parameters for filtering products
 */
export interface ProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

