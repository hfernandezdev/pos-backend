import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { InventoryService } from '../inventory/inventory.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly inventoryService: InventoryService,
    private readonly usersService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    let totalPrice = 0;
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      const product = await this.inventoryService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Producto con ID ${item.productId} no encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new NotFoundException(`Stock insuficiente para el producto ${product.name}`);
      }

      const itemPrice = product.price * item.quantity;
      totalPrice += itemPrice;

      const orderItem = this.orderItemRepository.create({
        product,
        quantity: item.quantity,
        price: product.price,
      });

      orderItems.push(orderItem);

      await this.inventoryService.updateStock(item.productId, -item.quantity);
    }

    const order = this.orderRepository.create({
      user,
      items: orderItems,
      totalPrice,
    });

    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({ relations: ['user', 'items', 'items.product'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }
    return order;
  }
}
