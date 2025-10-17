/**
 * Order models and interfaces
 * Matches backend DTOs for type safety
 */

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
}

export interface OrderDetails extends Order {
  notes?: string;
  items: OrderItem[];
  updatedAt: Date;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtOrder: number;
  subtotal: number;
}

export interface CreateOrderItemDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  customerName: string;
  customerEmail: string;
  items: CreateOrderItemDto[];
  notes?: string;
}

export interface UpdateOrderDto {
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
}

export interface OrderFilter {
  page?: number;
  limit?: number;
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';
  search?: string;
  fromDate?: string;
  toDate?: string;
}

