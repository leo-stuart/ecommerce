import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';

/**
 * Orders Controller - MVC Layer: CONTROLLER
 * Responsible for: HTTP request handling, routing, response formatting
 * Contains: Route decorators, parameter extraction, service calls
 * Does NOT contain: Business logic, database operations
 *
 * Controllers should be THIN (max 50 lines per method)
 * All business logic is delegated to OrdersService
 */
@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * POST /api/orders
   * Create a new order
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates a new order with selected products and quantities. Validates stock availability and calculates total.',
  })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          status: 'pending',
          totalAmount: 2599.98,
          notes: 'Please deliver before 5 PM',
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'Laptop Dell XPS 15',
              quantity: 2,
              priceAtOrder: 1299.99,
              subtotal: 2599.98,
            },
          ],
          itemCount: 1,
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error or insufficient stock' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  /**
   * GET /api/orders
   * Get all orders with pagination and filters
   */
  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description: 'Retrieves paginated list of orders with optional filters for status, date range, and customer search',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Items per page' })
  @ApiQuery({ name: 'status', required: false, type: String, example: 'pending', description: 'Filter by order status (pending, processing, completed, cancelled)' })
  @ApiQuery({ name: 'customerName', required: false, type: String, example: 'John', description: 'Search by customer name' })
  @ApiResponse({
    status: 200,
    description: 'Orders retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          {
            id: 1,
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            status: 'pending',
            totalAmount: 2599.98,
            itemCount: 2,
            createdAt: '2025-01-15T10:00:00.000Z',
          },
        ],
        meta: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      },
    },
  })
  async findAll(@Query() filterDto: FilterOrderDto) {
    return await this.ordersService.findAll(filterDto);
  }

  /**
   * GET /api/orders/statistics
   * Get order statistics
   */
  @Get('statistics')
  @ApiOperation({
    summary: 'Get order statistics',
    description: 'Returns aggregated statistics by order status',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        success: true,
        data: [
          { status: 'pending', count: 15, totalRevenue: 15000 },
          { status: 'completed', count: 45, totalRevenue: 50000 },
        ],
      },
    },
  })
  async getStatistics() {
    return await this.ordersService.getStatistics();
  }

  /**
   * GET /api/orders/:id
   * Get a single order by ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get order by ID',
    description: 'Retrieves a single order with full details including all items',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Order ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    schema: {
      example: {
        success: true,
        data: {
          id: 1,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          status: 'pending',
          totalAmount: 2599.98,
          notes: 'Urgent delivery',
          items: [
            {
              id: 1,
              productId: 1,
              productName: 'Laptop Dell XPS 15',
              quantity: 2,
              priceAtOrder: 1299.99,
              subtotal: 2599.98,
            },
          ],
          itemCount: 1,
          createdAt: '2025-01-15T10:00:00.000Z',
          updatedAt: '2025-01-15T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  /**
   * PATCH /api/orders/:id
   * Update order (status and notes only)
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update order',
    description: 'Updates order status and notes. Items cannot be modified after order creation.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Order ID' })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 409, description: 'Cannot update cancelled or completed orders' })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.ordersService.update(+id, updateOrderDto);
  }

  /**
   * DELETE /api/orders/:id
   * Cancel order (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Cancel order',
    description: 'Cancels an order by setting status to cancelled',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'Order ID' })
  @ApiResponse({ status: 204, description: 'Order cancelled successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @ApiResponse({ status: 409, description: 'Cannot cancel completed orders' })
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(+id);
  }
}

