import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../common/dto/pagination.dto';

/**
 * Filter Order DTO - MVC Layer: VIEW (Query Validation)
 * Validates query parameters for filtering orders
 */
export class FilterOrderDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by order status',
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    example: 'pending',
  })
  @IsEnum(['pending', 'processing', 'completed', 'cancelled'])
  @IsOptional()
  status?: 'pending' | 'processing' | 'completed' | 'cancelled';

  @ApiPropertyOptional({
    description: 'Search by customer name or email',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter orders created after this date',
    example: '2025-01-01',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  fromDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter orders created before this date',
    example: '2025-12-31',
  })
  @IsDateString()
  @IsOptional()
  @Type(() => Date)
  toDate?: Date;
}

