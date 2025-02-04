import { ORDER_STATUS } from 'src/core/types/orderStatus';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { DeliveryManNotFoundError } from '../errors/recipient-not-found-error';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { RoleProps } from 'src/core/types/role';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface UpdateOrderStatusUseCaseRequest {
  orderId: string;
  deliveryManId: string;
  status: ORDER_STATUS;
  role: RoleProps;
}

export class UpdateOrderStatusUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}

  async execute({
    deliveryManId,
    orderId,
    status,
    role,
  }: UpdateOrderStatusUseCaseRequest) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }
    if (role !== 'ADMIN' && status === 'AWAITING_PICKUP') {
      throw new NotAllowedError();
    }
    const isSameDeliveryMan = order.deliveryManId.toString() === deliveryManId;
    if (status === 'DELIVERED' && !isSameDeliveryMan) {
      throw new NotAllowedError();
    }
    await this.orderRepository.updateOrderStatus({
      orderId,
      status,
    });
  }
}
