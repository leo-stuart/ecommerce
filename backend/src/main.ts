import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix
  const apiPrefix = configService.get<string>('API_PREFIX') || 'api';
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: [
      configService.get<string>('CORS_ORIGIN') || 'http://localhost:4200',
      'https://teste-zoppy-frontend-production.up.railway.app',
      'https://teste-zoppy-production.up.railway.app'
    ],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Zoppy CRUD API')
    .setDescription(
      'RESTful API for managing products and orders in the Zoppy e-commerce system. ' +
      'Built with NestJS following MVC architecture and best practices. ' +
      'Features include pagination, filtering, validation, and comprehensive error handling.',
    )
    .setVersion('1.0')
    .setContact('Zoppy Team', 'https://zoppy.com', 'dev@zoppy.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('products', 'Product management endpoints - CRUD operations for products')
    .addTag('orders', 'Order management endpoints - CRUD operations for orders with items')
    .addServer(`http://localhost:${configService.get<number>('PORT') || 3000}`, 'Development')
    .addServer('http://localhost:3000', 'Local')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Zoppy API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    },
  });

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
