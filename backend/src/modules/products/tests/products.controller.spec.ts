import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../controllers/products.controller';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto, SortOrder } from '../dto/filter-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    sku: 'TEST-001',
    category: 'Electronics',
    imageUrl: 'http://example.com/image.jpg',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockProductsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getCountByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 199.99,
        stock: 20,
        sku: 'NEW-001',
        category: 'Electronics',
      };

      mockProductsService.create.mockResolvedValue(mockProduct);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [mockProduct],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockProductsService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(mockResponse);
    });

    it('should handle filter parameters', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        search: 'Test',
        category: 'Electronics',
        minPrice: 50,
        maxPrice: 200,
        inStock: true,
        sortBy: 'name' as any,
        sortOrder: SortOrder.ASC,
      };

      const mockResponse = {
        data: [mockProduct],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockProductsService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      mockProductsService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 299.99,
      };

      const updatedProduct = { ...mockProduct, ...updateDto };
      mockProductsService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('getCountByCategory', () => {
    it('should return product count by category', async () => {
      const mockCategoryCount = [
        { category: 'Electronics', count: 10 },
        { category: 'Books', count: 5 },
      ];

      mockProductsService.getCountByCategory.mockResolvedValue(mockCategoryCount);

      const result = await controller.getCountByCategory();

      expect(service.getCountByCategory).toHaveBeenCalled();
      expect(result).toEqual(mockCategoryCount);
    });
  });
});

