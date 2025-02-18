import { Injectable } from '@nestjs/common';
import {
  findManyNearbyProps,
  OrderRepository,
  updateOrderStatusProps,
} from 'src/domain/deliveries/application/repositories/order-repository';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  create(order: Order): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(order: Order): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateOrderStatus(params: updateOrderStatusProps): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findAllByUser(id: string): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
  findManyNearby(params: findManyNearbyProps): Promise<Order[]> {
    throw new Error('Method not implemented.');
  }
}
