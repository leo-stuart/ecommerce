import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../controllers/orders.controller';
import { OrdersService } from '../services/orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { FilterOrderDto } from '../dto/filter-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrderResponse = {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'pending' as const,
    totalAmount: 199.98,
    notes: 'Test order',
    items: [
      {
        id: 1,
        productId: 1,
        productName: 'Test Product',
        quantity: 2,
        priceAtOrder: 99.99,
        subtotal: 199.98,
      },
    ],
    itemCount: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockOrderListResponse = {
    id: 1,
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    status: 'pending' as const,
    totalAmount: 199.98,
    itemCount: 1,
    createdAt: new Date(),
  };

  const mockOrdersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createDto: CreateOrderDto = {
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        notes: 'Test order',
        items: [
          { productId: 1, quantity: 2 },
        ],
      };

      mockOrdersService.create.mockResolvedValue(mockOrderResponse);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockOrderResponse);
      expect(result.totalAmount).toBe(199.98);
    });

    it('should create order with multiple items', async () => {
      const createDto: CreateOrderDto = {
        customerName: 'Jane Smith',
        customerEmail: 'jane@example.com',
        items: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 },
        ],
      };

      const multiItemResponse = {
        ...mockOrderResponse,
        itemCount: 2,
      };

      mockOrdersService.create.mockResolvedValue(multiItemResponse);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result.itemCount).toBe(2);
    });
  });

  describe('findAll', () => {
    it('should return paginated orders', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [mockOrderListResponse],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockOrdersService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
      expect(result).toEqual(mockResponse);
      expect(result.data).toHaveLength(1);
    });

    it('should handle filter parameters', async () => {
      const filterDto: FilterOrderDto = {
        page: 1,
        limit: 10,
        status: 'pending',
        search: 'John',
        fromDate: new Date('2025-01-01'),
        toDate: new Date('2025-12-31'),
      };

      const mockResponse = {
        data: [mockOrderListResponse],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      mockOrdersService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should handle pagination for multiple pages', async () => {
      const filterDto: FilterOrderDto = {
        page: 2,
        limit: 10,
      };

      const mockResponse = {
        data: [mockOrderListResponse],
        meta: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        },
      };

      mockOrdersService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(result.meta.hasNextPage).toBe(true);
      expect(result.meta.hasPreviousPage).toBe(true);
    });
  });

  describe('findOne', () => {
    it('should return a single order', async () => {
      mockOrdersService.findOne.mockResolvedValue(mockOrderResponse);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockOrderResponse);
      expect(result.items).toBeDefined();
    });

    it('should convert string id to number', async () => {
      mockOrdersService.findOne.mockResolvedValue(mockOrderResponse);

      await controller.findOne('123');

      expect(service.findOne).toHaveBeenCalledWith(123);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateDto: UpdateOrderDto = {
        status: 'processing',
        notes: 'Updated notes',
      };

      const updatedOrder = {
        ...mockOrderResponse,
        status: 'processing' as const,
        notes: 'Updated notes',
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.status).toBe('processing');
      expect(result.notes).toBe('Updated notes');
    });

    it('should update only status', async () => {
      const updateDto: UpdateOrderDto = {
        status: 'completed',
      };

      const updatedOrder = {
        ...mockOrderResponse,
        status: 'completed' as const,
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.status).toBe('completed');
    });

    it('should update only notes', async () => {
      const updateDto: UpdateOrderDto = {
        notes: 'Only notes updated',
      };

      const updatedOrder = {
        ...mockOrderResponse,
        notes: 'Only notes updated',
      };

      mockOrdersService.update.mockResolvedValue(updatedOrder);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result.notes).toBe('Only notes updated');
    });
  });

  describe('remove', () => {
    it('should cancel an order', async () => {
      mockOrdersService.remove.mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should convert string id to number', async () => {
      mockOrdersService.remove.mockResolvedValue(undefined);

      await controller.remove('456');

      expect(service.remove).toHaveBeenCalledWith(456);
    });
  });

  describe('getStatistics', () => {
    it('should return order statistics', async () => {
      const mockStats = [
        { status: 'pending', count: 5, totalRevenue: 500.0 },
        { status: 'processing', count: 3, totalRevenue: 300.0 },
        { status: 'completed', count: 10, totalRevenue: 1500.0 },
        { status: 'cancelled', count: 2, totalRevenue: 0 },
      ];

      mockOrdersService.getStatistics.mockResolvedValue(mockStats);

      const result = await controller.getStatistics();

      expect(service.getStatistics).toHaveBeenCalled();
      expect(result).toEqual(mockStats);
      expect(result).toHaveLength(4);
    });

    it('should return empty array if no orders', async () => {
      mockOrdersService.getStatistics.mockResolvedValue([]);

      const result = await controller.getStatistics();

      expect(result).toEqual([]);
    });
  });
});

