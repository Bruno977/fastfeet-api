import { ORDER_STATUS } from 'src/core/types/orderStatus';
import { Order } from '../../enterprise/entities/order';

export interface updateOrderStatusProps {
  orderId: string;
  status: ORDER_STATUS;
}

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(order: Order): Promise<void>;
  abstract updateOrderStatus({
    orderId,
    status,
  }: updateOrderStatusProps): Promise<void>;
  abstract findAllByUser(id: string): Promise<Order[]>;
}
