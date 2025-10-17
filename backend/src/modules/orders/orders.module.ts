import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersService } from './services/orders.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './models/order.model';
import { OrderItem } from './models/order-item.model';
import { Product } from '../products/models/product.model';

/**
 * Orders Module
 * Encapsulates all order-related functionality
 * Follows NestJS modular architecture
 */
@Module({
  imports: [
    SequelizeModule.forFeature([Order, OrderItem, Product]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}

