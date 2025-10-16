import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './models/product.model';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';

/**
 * Products Module
 * Encapsulates all product-related functionality following MVC pattern
 */
@Module({
  imports: [SequelizeModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}

