import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { Product } from '../../products/models/product.model';
import { OrderItem } from './order-item.model';

/**
 * Order Model - MVC Layer: MODEL
 * Represents a customer order with multiple products
 * 
 * Relationships:
 * - BelongsToMany Products (through OrderItems)
 * - HasMany OrderItems
 */
@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model<Order> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    comment: 'Customer name',
  })
  customerName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      isEmail: true,
    },
    comment: 'Customer email',
  })
  customerEmail: string;

  @Column({
    type: DataType.ENUM('pending', 'processing', 'completed', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false,
    comment: 'Order status',
  })
  status: 'pending' | 'processing' | 'completed' | 'cancelled';

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Total order amount',
  })
  totalAmount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Order notes or comments',
  })
  notes?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
    comment: 'Soft delete flag',
  })
  isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  updatedAt: Date;

  // Relationships
  @BelongsToMany(() => Product, () => OrderItem)
  products: Product[];

  @HasMany(() => OrderItem)
  orderItems: OrderItem[];
}

