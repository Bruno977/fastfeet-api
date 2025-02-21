import { Order } from 'src/domain/deliveries/enterprise/entities/order';

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      description: order.description,
      status: order.status,
      user_id: order.deliveryManId.toString(),
      recipient_id: order.recipientId.toString(),
      attachment_id: order.attachmentId?.toString(),
    };
  }
}
