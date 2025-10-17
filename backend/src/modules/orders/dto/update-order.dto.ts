import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Update Order DTO - MVC Layer: VIEW (Request Validation)
 * Validates incoming data for updating existing orders
 * Note: Items cannot be updated after order creation (business rule)
 */
export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Order status',
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    example: 'processing',
  })
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Order notes or special instructions',
    example: 'Customer requested express delivery',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  notes?: string;
}

