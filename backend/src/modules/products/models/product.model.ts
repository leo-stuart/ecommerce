import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

/**
 * Product Model - MVC Layer: MODEL
 * Responsible for: Data structure and database schema
 * Contains: Database columns, relationships, validations at DB level
 * Does NOT contain: Business logic, HTTP handling, data transformation
 */
@Table({
  tableName: 'products',
  underscored: true,
  paranoid: true, // Enables soft deletes (deleted_at)
})
export class Product extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  price: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  stock: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
    unique: true,
  })
  sku: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  category: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  imageUrl: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @CreatedAt
  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  declare createdAt: Date;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  declare updatedAt: Date;

  @DeletedAt
  @Column({
    type: DataType.DATE,
    field: 'deleted_at',
  })
  declare deletedAt: Date;
}

