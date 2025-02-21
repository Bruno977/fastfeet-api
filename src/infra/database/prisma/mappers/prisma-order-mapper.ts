import { UniqueEntityID } from './../../../../core/entities/unique-entity-id';
import { Order as OrderPrisma } from '@prisma/client';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';

export class PrismaOrderMapper {
  static toPrisma(order: Order): OrderPrisma {
    return {
      id: order.id.toString(),
      description: order.description,
      status: order.status,
      user_id: order.deliveryManId.toString(),
      recipient_id: order.recipientId.toString(),
    };
  }
  static toDomain(order: OrderPrisma): Order {
    return Order.create(
      {
        deliveryManId: new UniqueEntityID(order.user_id),
        status: order.status,
        description: order.description,
        recipientId: new UniqueEntityID(order.recipient_id),
      },
      new UniqueEntityID(order.id),
    );
  }
}
