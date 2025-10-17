import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { OrdersService } from '../services/orders.service';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Product } from '../../products/models/product.model';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderModel: any;
  let mockOrderItemModel: any;
  let mockProductModel: any;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    price: 99.99,
    stock: 10,
    isActive: true,
    save: jest.fn(),
  };

  const mockOrderItem = {
    id: 1,
    orderId: 1,
    productId: 1,
    quantity: 2,
    priceAtOrder: 99.99,
    subtotal: 199.98,
    product: mockProduct,
  };

  const mockOrder = {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'pending',
    totalAmount: 199.98,
    notes: 'Test order',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    orderItems: [mockOrderItem],
    update: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    mockOrderModel = {
      create: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      sequelize: {
        fn: jest.fn(),
        col: jest.fn(),
      },
    };

    mockOrderItemModel = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    mockProductModel = {
      findAll: jest.fn(),
      findByPk: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken(Order),
          useValue: mockOrderModel,
        },
        {
          provide: getModelToken(OrderItem),
          useValue: mockOrderItemModel,
        },
        {
          provide: getModelToken(Product),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto: CreateOrderDto = {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      notes: 'Test order',
      items: [
        { productId: 1, quantity: 2 },
      ],
    };

    it('should create an order successfully', async () => {
      const product = { ...mockProduct, stock: 10 };
      mockProductModel.findAll.mockResolvedValue([product]);
      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderItemModel.create.mockResolvedValue(mockOrderItem);

      const result = await service.create(createDto);

      expect(mockProductModel.findAll).toHaveBeenCalledWith({
        where: { id: [1], isActive: true },
      });
      expect(mockOrderModel.create).toHaveBeenCalled();
      expect(mockOrderItemModel.create).toHaveBeenCalled();
      expect(product.save).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.customerName).toBe('John Doe');
    });

    it('should throw BadRequestException if product not found', async () => {
      mockProductModel.findAll.mockResolvedValue([]);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockOrderModel.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if product is inactive', async () => {
      mockProductModel.findAll.mockResolvedValue([]);

      await expect(service.create(createDto)).rejects.toThrow(
        'One or more products not found or inactive',
      );
    });

    it('should throw BadRequestException if insufficient stock', async () => {
      const product = { ...mockProduct, stock: 1 };
      mockProductModel.findAll.mockResolvedValue([product]);

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockOrderModel.create).not.toHaveBeenCalled();
    });

    it('should calculate total amount correctly', async () => {
      const product = { ...mockProduct, price: 50.0, stock: 10 };
      mockProductModel.findAll.mockResolvedValue([product]);
      
      const order = { ...mockOrder, totalAmount: 100.0 };
      mockOrderModel.create.mockResolvedValue(order);
      mockOrderItemModel.create.mockResolvedValue({
        ...mockOrderItem,
        priceAtOrder: 50.0,
        subtotal: 100.0,
      });

      await service.create(createDto);

      expect(mockOrderModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 100.0,
        }),
      );
    });

    it('should update product stock after order creation', async () => {
      const product = { ...mockProduct, stock: 10, save: jest.fn() };
      mockProductModel.findAll.mockResolvedValue([product]);
      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderItemModel.create.mockResolvedValue(mockOrderItem);

      await service.create(createDto);

      expect(product.stock).toBe(8); // 10 - 2
      expect(product.save).toHaveBeenCalled();
    });

    it('should create order with multiple products', async () => {
      const createDtoMultiple: CreateOrderDto = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const products = [
        { ...mockProduct, id: 1, price: 50.0, stock: 10, save: jest.fn() },
        { ...mockProduct, id: 2, price: 75.0, stock: 5, save: jest.fn() },
      ];

      mockProductModel.findAll.mockResolvedValue(products);
      mockOrderModel.create.mockResolvedValue(mockOrder);
      mockOrderItemModel.create.mockResolvedValue(mockOrderItem);

      await service.create(createDtoMultiple);

      expect(mockOrderItemModel.create).toHaveBeenCalledTimes(2);
      expect(mockOrderModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          totalAmount: 175.0, // (50 * 2) + (75 * 1)
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
      };

      mockOrderModel.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
        count: 1,
      });

      const result = await service.findAll(filterDto);

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPreviousPage).toBe(false);
    });

    it('should apply status filter', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
        status: 'pending',
      };

      mockOrderModel.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockOrderModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'pending',
          }),
        }),
      );
    });

    it('should apply search filter', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
        search: 'John',
      };

      mockOrderModel.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockOrderModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should apply date range filter', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-12-31'),
      };

      mockOrderModel.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
        count: 1,
      });

      await service.findAll(filterDto);

      expect(mockOrderModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should calculate pagination correctly for multiple pages', async () => {
      const filterDto: FilterOrderDto = {
        page: 2,
        limit: 10,
      };

      mockOrderModel.findAndCountAll.mockResolvedValue({
        rows: [mockOrder],
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
    it('should return an order by id', async () => {
      mockOrderModel.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(mockOrderModel.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1, isActive: true },
        }),
      );
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.customerName).toBe('John Doe');
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderModel.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });

    it('should include order items in response', async () => {
      mockOrderModel.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOne(1);

      expect(result.items).toBeDefined();
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.itemCount).toBe(1);
    });
  });

  describe('update', () => {
    it('should update an order successfully', async () => {
      const updateDto: UpdateOrderDto = {
        status: 'processing',
        notes: 'Updated notes',
      };

      const updatedOrder = { ...mockOrder, ...updateDto };
      mockOrderModel.findOne.mockResolvedValue(mockOrder);
      mockOrder.update.mockResolvedValue(updatedOrder);
      // Mock findOne again for the return call
      mockOrderModel.findOne.mockResolvedValueOnce(mockOrder).mockResolvedValueOnce(updatedOrder);

      const result = await service.update(1, updateDto);

      expect(mockOrder.update).toHaveBeenCalledWith(updateDto);
      expect(result).toBeDefined();
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderModel.findOne.mockResolvedValue(null);

      await expect(
        service.update(999, { status: 'processing' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if order is cancelled', async () => {
      const cancelledOrder = { ...mockOrder, status: 'cancelled' };
      mockOrderModel.findOne.mockResolvedValue(cancelledOrder);

      await expect(
        service.update(1, { status: 'processing' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException if trying to change completed order to pending', async () => {
      const completedOrder = { ...mockOrder, status: 'completed' };
      mockOrderModel.findOne.mockResolvedValue(completedOrder);

      await expect(
        service.update(1, { status: 'pending' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should allow updating notes only', async () => {
      const updateDto: UpdateOrderDto = {
        notes: 'New notes',
      };

      mockOrderModel.findOne.mockResolvedValue(mockOrder);
      mockOrder.update.mockResolvedValue({ ...mockOrder, ...updateDto });
      mockOrderModel.findOne.mockResolvedValueOnce(mockOrder).mockResolvedValueOnce(mockOrder);

      await service.update(1, updateDto);

      expect(mockOrder.update).toHaveBeenCalledWith(updateDto);
    });
  });

  describe('remove', () => {
    it('should cancel an order successfully', async () => {
      mockOrderModel.findOne.mockResolvedValue(mockOrder);
      mockOrder.update.mockResolvedValue(undefined);

      await service.remove(1);

      expect(mockOrder.update).toHaveBeenCalledWith({
        status: 'cancelled',
        isActive: false,
      });
    });

    it('should throw NotFoundException if order not found', async () => {
      mockOrderModel.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if order is completed', async () => {
      const completedOrder = { ...mockOrder, status: 'completed' };
      mockOrderModel.findOne.mockResolvedValue(completedOrder);

      await expect(service.remove(1)).rejects.toThrow(ConflictException);
    });
  });

  describe('getStatistics', () => {
    it('should return order statistics', async () => {
      const mockStats = [
        { status: 'pending', count: 5, totalRevenue: 500.0 },
        { status: 'completed', count: 10, totalRevenue: 1500.0 },
      ];

      mockOrderModel.findAll.mockResolvedValue(mockStats);

      const result = await service.getStatistics();

      expect(mockOrderModel.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
    });
  });
});

