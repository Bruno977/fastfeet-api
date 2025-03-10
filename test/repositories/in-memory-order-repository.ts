import { PaginationParams } from 'src/core/repositories/pagination-params';
import { Geolocation } from 'src/domain/deliveries/application/geolocation/geolocation';
import {
  findManyNearbyProps,
  OrderRepository,
  updateOrderStatusProps,
} from 'src/domain/deliveries/application/repositories/order-repository';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';

export class InMemoryOrderRepository implements OrderRepository {
  public order: Order[] = [];

  constructor(private recipientRepository: RecipientRepository) {}

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
  async findAllByUser(id: string, params?: PaginationParams) {
    const filteredOrders = this.order.filter(
      (order) => order.deliveryManId.toString() === id,
    );

    if (params && params.page) {
      const startIndex = (params.page - 1) * 20;
      const endIndex = params.page * 20;
      return filteredOrders.slice(startIndex, endIndex);
    } else {
      return filteredOrders;
    }
  }
  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = this.order.slice((page - 1) * 20, page * 20);
    return orders;
  }
  async findManyNearby(params: findManyNearbyProps) {
    const nearbyOrders: Order[] = [];

    for (const order of params.orders) {
      const recipient = await this.recipientRepository.findById(
        order.recipientId.toString(),
      );

      if (!recipient) {
        return [];
      }
      const distance = Geolocation.getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: recipient.address.latitude,
          longitude: recipient.address.longitude,
        },
      );

      if (distance < 10) {
        nearbyOrders.push(order);
      }
    }
    return nearbyOrders.slice((params.page - 1) * 20, params.page * 20);
  }
}
