import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FilterProductDto, SortOrder } from '../dto/filter-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let mockProductModel: any;

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
    update: jest.fn(),
    destroy: jest.fn(),
  };

  beforeEach(async () => {
    mockProductModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      sequelize: {
        fn: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 199.99,
        stock: 20,
        sku: 'NEW-001',
        category: 'Electronics',
      };

      mockProductModel.findOne.mockResolvedValue(null);
      mockProductModel.create.mockResolvedValue({ ...mockProduct, ...createDto });

      const result = await service.create(createDto);

      expect(mockProductModel.findOne).toHaveBeenCalledWith({
        where: { sku: createDto.sku },
      });
      expect(mockProductModel.create).toHaveBeenCalledWith(createDto);
      expect(result.name).toBe(createDto.name);
    });

    it('should throw ConflictException if SKU already exists', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        price: 199.99,
        stock: 20,
        sku: 'EXISTING-001',
      };

      mockProductModel.findOne.mockResolvedValue(mockProduct);

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
      expect(mockProductModel.create).not.toHaveBeenCalled();
    });

    it('should create product without SKU', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        price: 199.99,
        stock: 20,
      };

      mockProductModel.create.mockResolvedValue({ ...mockProduct, ...createDto });

      const result = await service.create(createDto);

      expect(mockProductModel.findOne).not.toHaveBeenCalled();
      expect(mockProductModel.create).toHaveBeenCalledWith(createDto);
      expect(result).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
      };

      const mockProducts = [mockProduct, { ...mockProduct, id: 2 }];
      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: mockProducts,
        count: 2,
      });

      const result = await service.findAll(filterDto);

      expect(result.data).toEqual(mockProducts);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should apply search filter', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        search: 'Test',
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });

    it('should apply category filter', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        category: 'Electronics',
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Electronics',
          }),
        }),
      );
    });

    it('should apply price range filter', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        minPrice: 50,
        maxPrice: 200,
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should apply stock filter', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        inStock: true,
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should apply sorting', async () => {
      const filterDto: FilterProductDto = {
        page: 1,
        limit: 10,
        sortBy: 'name' as any,
        sortOrder: SortOrder.ASC,
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockProductModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['name', SortOrder.ASC]],
        }),
      );
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      const filterDto: FilterProductDto = {
        page: 2,
        limit: 10,
      };

      mockProductModel.findAndCountAll.mockResolvedValue({
        rows: [mockProduct],
        count: 25,
      });

      const result = await service.findAll(filterDto);

      expect(result.meta.page).toBe(2);
      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);

      const result = await service.findOne(1);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 299.99,
      };

      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockProduct.update.mockResolvedValue({ ...mockProduct, ...updateDto });

      const result = await service.update(1, updateDto);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockProduct.update).toHaveBeenCalledWith(updateDto);
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(
        service.update(999, { name: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if new SKU already exists', async () => {
      const updateDto: UpdateProductDto = {
        sku: 'EXISTING-002',
      };

      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockProductModel.findOne.mockResolvedValue({ id: 2, sku: 'EXISTING-002' });

      await expect(service.update(1, updateDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should allow updating with same SKU', async () => {
      const updateDto: UpdateProductDto = {
        sku: 'TEST-001',
        name: 'Updated',
      };

      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockProduct.update.mockResolvedValue({ ...mockProduct, ...updateDto });

      await service.update(1, updateDto);

      expect(mockProductModel.findOne).not.toHaveBeenCalled();
      expect(mockProduct.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockProductModel.findByPk.mockResolvedValue(mockProduct);
      mockProduct.destroy.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockProductModel.findByPk).toHaveBeenCalledWith(1);
      expect(mockProduct.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if product not found', async () => {
      mockProductModel.findByPk.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getCountByCategory', () => {
    it('should return product count by category', async () => {
      const mockResults = [
        { category: 'Electronics', get: jest.fn().mockReturnValue('10') },
        { category: 'Books', get: jest.fn().mockReturnValue('5') },
      ];

      mockProductModel.findAll.mockResolvedValue(mockResults);

      const result = await service.getCountByCategory();

      expect(result).toEqual([
        { category: 'Electronics', count: 10 },
        { category: 'Books', count: 5 },
      ]);
    });
  });
});

