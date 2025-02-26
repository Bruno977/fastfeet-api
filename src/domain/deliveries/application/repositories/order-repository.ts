import { ORDER_STATUS } from 'src/core/types/orderStatus';
import { Order } from '../../enterprise/entities/order';
import { PaginationParams } from 'src/core/repositories/pagination-params';

export interface updateOrderStatusProps {
  orderId: string;
  status: ORDER_STATUS;
}
export interface findManyNearbyProps {
  latitude: number;
  longitude: number;
  deliveryManId: string;
  orders: Order[];
}

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(order: Order): Promise<void>;
  abstract updateOrderStatus(params: updateOrderStatusProps): Promise<void>;
  abstract findAllByUser(id: string): Promise<Order[]>;
  abstract findMany({ page }: PaginationParams): Promise<Order[]>;
  abstract findManyNearby(params: findManyNearbyProps): Promise<Order[]>;
}
