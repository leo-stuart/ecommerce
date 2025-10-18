import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { Product } from '../modules/products/models/product.model';
import { Order } from '../modules/orders/models/order.model';
import { OrderItem } from '../modules/orders/models/order-item.model';

/**
 * Database Seeder Script
 * Populates the database with sample data for testing
 */
async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Create NestJS application context
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await OrderItem.destroy({ where: {}, force: true });
    await Order.destroy({ where: {}, force: true });
    await Product.destroy({ where: {}, force: true });

    // Seed Products
    console.log('📦 Creating products...');
    const products = await Product.bulkCreate([
      {
        name: 'Smartphone Samsung Galaxy S24',
        description: 'Smartphone premium com câmera de 200MP e tela AMOLED de 6.2"',
        price: 2999.99,
        stock: 50,
        sku: 'SAMSUNG-S24-128GB',
        category: 'Smartphones',
        imageUrl: 'https://images.samsung.com/br/smartphones/galaxy-s24/images/galaxy-s24-highlights-design-mo.jpg',
        isActive: true,
      },
      {
        name: 'Notebook Dell Inspiron 15',
        description: 'Notebook para trabalho e estudos com processador Intel i5',
        price: 2499.99,
        stock: 25,
        sku: 'DELL-INSPIRON-15-I5',
        category: 'Notebooks',
        imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/15-3520/media-gallery/in3520-cnb-00000ff090-sl.psd',
        isActive: true,
      },
      {
        name: 'Fone de Ouvido Sony WH-1000XM5',
        description: 'Fone de ouvido com cancelamento de ruído líder da indústria',
        price: 1299.99,
        stock: 30,
        sku: 'SONY-WH1000XM5',
        category: 'Áudio',
        imageUrl: 'https://www.sony.com.br/image/4b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b',
        isActive: true,
      },
      {
        name: 'Smartwatch Apple Watch Series 9',
        description: 'Relógio inteligente com GPS e monitoramento de saúde',
        price: 1999.99,
        stock: 20,
        sku: 'APPLE-WATCH-S9-45MM',
        category: 'Wearables',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-45mm-gps-pink-sand-aluminum-pink-sport-band-s9?wid=2000&hei=2000&fmt=png-alpha&.v=1692895702000',
        isActive: true,
      },
      {
        name: 'Tablet iPad Air 5ª Geração',
        description: 'Tablet com chip M1 e tela Liquid Retina de 10.9"',
        price: 3499.99,
        stock: 15,
        sku: 'APPLE-IPAD-AIR-5-64GB',
        category: 'Tablets',
        imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-air-select-wifi-blue-202203?wid=2000&hei=2000&fmt=png-alpha&.v=1645065732684',
        isActive: true,
      },
      {
        name: 'Monitor LG UltraWide 29"',
        description: 'Monitor ultrawide para produtividade e entretenimento',
        price: 899.99,
        stock: 40,
        sku: 'LG-29WN600-W',
        category: 'Monitores',
        imageUrl: 'https://www.lg.com/br/images/monitores/md07518696/gallery/medium01.jpg',
        isActive: true,
      },
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Seed Orders
    console.log('🛒 Creating orders...');
    const orders = await Order.bulkCreate([
      {
        customerName: 'João Silva',
        customerEmail: 'joao.silva@email.com',
        status: 'completed',
        totalAmount: 4299.98,
        notes: 'Cliente preferencial - entrega rápida',
        isActive: true,
      } as any,
      {
        customerName: 'Maria Santos',
        customerEmail: 'maria.santos@email.com',
        status: 'processing',
        totalAmount: 1799.98,
        notes: 'Pagamento via PIX',
        isActive: true,
      } as any,
      {
        customerName: 'Pedro Oliveira',
        customerEmail: 'pedro.oliveira@email.com',
        status: 'pending',
        totalAmount: 1299.99,
        notes: 'Aguardando confirmação de pagamento',
        isActive: true,
      } as any,
    ]);

    console.log(`✅ Created ${orders.length} orders`);

    // Seed Order Items
    console.log('📋 Creating order items...');
    const orderItems = await OrderItem.bulkCreate([
      // Order 1: João Silva
      {
        orderId: orders[0].id!,
        productId: products[0].id!, // Samsung Galaxy S24
        quantity: 1,
        priceAtOrder: 2999.99,
        subtotal: 2999.99,
      } as any,
      {
        orderId: orders[0].id!,
        productId: products[2].id!, // Sony WH-1000XM5
        quantity: 1,
        priceAtOrder: 1299.99,
        subtotal: 1299.99,
      } as any,
      // Order 2: Maria Santos
      {
        orderId: orders[1].id!,
        productId: products[1].id!, // Dell Inspiron 15
        quantity: 1,
        priceAtOrder: 2499.99,
        subtotal: 2499.99,
      } as any,
      {
        orderId: orders[1].id!,
        productId: products[5].id!, // LG UltraWide
        quantity: 1,
        priceAtOrder: 899.99,
        subtotal: 899.99,
      } as any,
      // Order 3: Pedro Oliveira
      {
        orderId: orders[2].id!,
        productId: products[2].id!, // Sony WH-1000XM5
        quantity: 1,
        priceAtOrder: 1299.99,
        subtotal: 1299.99,
      } as any,
    ]);

    console.log(`✅ Created ${orderItems.length} order items`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Products: ${products.length}`);
    console.log(`- Orders: ${orders.length}`);
    console.log(`- Order Items: ${orderItems.length}`);

    await app.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

// Run the seeder
seed();
