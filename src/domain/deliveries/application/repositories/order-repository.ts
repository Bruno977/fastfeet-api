import { Order } from '../../enterprise/entities/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>;
  abstract findById(id: string): Promise<Order | null>;
  abstract delete(id: string): Promise<void>;
  abstract update(order: Order): Promise<void>;
}
