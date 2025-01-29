import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { ORDER_STATUS } from 'src/core/types/orderStatus';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';

interface UpdateOrderUseCaseRequest {
  orderId: string;
  role: RoleProps;
  status: ORDER_STATUS;
  description: string;
  deliveryManId: string;
}

export class UpdateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryMan: DeliveryManRepository,
  ) {}
  async execute({
    orderId,
    role,
    status,
    description,
    deliveryManId,
  }: UpdateOrderUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    const deliveryMan = await this.deliveryMan.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }
    order.status = status;
    order.description = description;

    await this.orderRepository.update(order);
  }
}
