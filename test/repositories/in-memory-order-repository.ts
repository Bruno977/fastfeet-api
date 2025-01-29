import {
  OrderRepository,
  updateOrderStatusProps,
} from 'src/domain/deliveries/application/repositories/order-repository';
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
  async delete(id: string) {
    this.order = this.order.filter((order) => order.id.toString() !== id);
  }
  async update(order: Order) {
    this.order = this.order.map((o) =>
      o.id.toString() === order.id.toString() ? order : o,
    );
  }
  async updateOrderStatus({ orderId, status }: updateOrderStatusProps) {
    this.order = this.order.map((order) => {
      if (order.id.toString() === orderId) {
        order.status = status;
      }
      return order;
    });
  }
}
