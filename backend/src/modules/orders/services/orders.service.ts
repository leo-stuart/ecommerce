import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Product } from '../../products/models/product.model';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';
import {
  OrderResponseDto,
  OrderListResponseDto,
  OrderItemResponseDto,
} from '../dto/order-response.dto';

/**
 * Orders Service - Business Logic Layer
 * Responsible for: All order-related business logic
 * Contains: CRUD operations, calculations, validations, relationships
 * Does NOT contain: HTTP handling, route definitions
 */
@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(OrderItem)
    private orderItemModel: typeof OrderItem,
    @InjectModel(Product)
    private productModel: typeof Product,
  ) {}

  /**
   * Create a new order with products
   */
  async create(createOrderDto: CreateOrderDto): Promise<OrderResponseDto> {
    // Validate all products exist and have sufficient stock
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products = await this.productModel.findAll({
      where: { id: productIds, isActive: true },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more products not found or inactive');
    }

    // Validate stock availability
    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      const subtotal = Number(product.price) * item.quantity;
      totalAmount += subtotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: product.price,
        subtotal,
      });
    }

    // Create order
    const order = await this.orderModel.create({
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      status: 'pending',
      totalAmount,
      notes: createOrderDto.notes,
    });

    // Create order items
    const orderItems = await Promise.all(
      orderItemsData.map((itemData) =>
        this.orderItemModel.create({
          ...itemData,
          orderId: order.id,
        }),
      ),
    );

    // Update product stock
    for (const item of createOrderDto.items) {
      const product = products.find((p) => p.id === item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Return formatted response
    return this.formatOrderResponse(order, orderItems, products);
  }

  /**
   * Get all orders with pagination and filters
   */
  async findAll(filterDto: FilterOrderDto): Promise<{
    data: OrderListResponseDto[];
    meta: any;
  }> {
    const { page = 1, limit = 10, status, search, fromDate, toDate } = filterDto;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = { isActive: true };

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { customerEmail: { [Op.like]: `%${search}%` } },
      ];
    }

    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) {
        where.createdAt[Op.gte] = fromDate;
      }
      if (toDate) {
        where.createdAt[Op.lte] = toDate;
      }
    }

    // Execute query
    const { rows: orders, count: total } = await this.orderModel.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          attributes: ['id', 'quantity', 'priceAtOrder', 'subtotal'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Format response
    const data = orders.map((order) => ({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      itemCount: order.orderItems?.length || 0,
      createdAt: order.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get single order by ID with full details
   */
  async findOne(id: number): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      where: { id, isActive: true },
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'sku'],
            },
          ],
        },
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Format order items with product details
    const items: OrderItemResponseDto[] = order.orderItems.map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productName: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      priceAtOrder: Number(item.priceAtOrder),
      subtotal: Number(item.subtotal),
    }));

    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      notes: order.notes,
      items,
      itemCount: items.length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  /**
   * Update order (only status and notes can be updated)
   */
  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto> {
    const order = await this.orderModel.findOne({
      where: { id, isActive: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Business rule: Cannot change status of cancelled orders
    if (order.status === 'cancelled') {
      throw new ConflictException('Cannot update cancelled orders');
    }

    // Business rule: Cannot change status of completed orders back to pending
    if (order.status === 'completed' && updateOrderDto.status === 'pending') {
      throw new ConflictException('Cannot change completed order back to pending');
    }

    // Update order
    await order.update(updateOrderDto);

    // Return full order details
    return this.findOne(id);
  }

  /**
   * Cancel order (soft delete)
   */
  async remove(id: number): Promise<void> {
    const order = await this.orderModel.findOne({
      where: { id, isActive: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    // Business rule: Cannot cancel completed orders
    if (order.status === 'completed') {
      throw new ConflictException('Cannot cancel completed orders');
    }

    // Update status to cancelled instead of hard delete
    await order.update({ status: 'cancelled', isActive: false });
  }

  /**
   * Get order statistics
   */
  async getStatistics(): Promise<any> {
    const stats = await this.orderModel.findAll({
      where: { isActive: true },
      attributes: [
        'status',
        [this.orderModel.sequelize.fn('COUNT', this.orderModel.sequelize.col('id')), 'count'],
        [this.orderModel.sequelize.fn('SUM', this.orderModel.sequelize.col('total_amount')), 'totalRevenue'],
      ],
      group: ['status'],
      raw: true,
    });

    return stats;
  }

  /**
   * Format order response with items
   */
  private formatOrderResponse(
    order: Order,
    orderItems: OrderItem[],
    products: Product[],
  ): OrderResponseDto {
    const items: OrderItemResponseDto[] = orderItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        id: item.id,
        productId: item.productId,
        productName: product?.name || 'Unknown Product',
        quantity: item.quantity,
        priceAtOrder: Number(item.priceAtOrder),
        subtotal: Number(item.subtotal),
      };
    });

    return {
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.status,
      totalAmount: Number(order.totalAmount),
      notes: order.notes,
      items,
      itemCount: items.length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
}

