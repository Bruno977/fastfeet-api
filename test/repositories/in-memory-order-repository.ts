import { OrderRepository } from 'src/domain/deliveries/application/repositories/order-repository';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  public order: Order[] = [];

  async create(order: Order) {
    this.order.push(order);
  }
  async findById(id: string) {
    const order =
      this.order.find((order) => order.id.toString() === id) || null;
    return order;
  }
}
