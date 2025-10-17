/**
 * Order Response DTOs - MVC Layer: VIEW (Response Formatting)
 * Defines the structure of data returned to clients
 */

export class OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  priceAtOrder: number;
  subtotal: number;
}

export class OrderResponseDto {
  id: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  notes?: string;
  items: OrderItemResponseDto[];
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderListResponseDto {
  id: number;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
}

