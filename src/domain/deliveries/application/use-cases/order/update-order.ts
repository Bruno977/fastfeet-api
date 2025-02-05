import { UniqueEntityID } from './../../../../../core/entities/unique-entity-id';
import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { ORDER_STATUS } from 'src/core/types/orderStatus';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { RecipientNotFoundError } from '../errors/recipient-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface UpdateOrderUseCaseRequest {
  orderId: string;
  role: RoleProps;
  status: ORDER_STATUS;
  description: string;
  deliveryManId: string;
  recipientId: string;
}

export class UpdateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryMan: DeliveryManRepository,
    private recipientRepository: RecipientRepository,
  ) {}
  async execute({
    orderId,
    role,
    status,
    description,
    deliveryManId,
    recipientId,
  }: UpdateOrderUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'update-order');
    if (!isAdmin) {
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
    const recipient = await this.recipientRepository.findById(recipientId);
    if (!recipient) {
      throw new RecipientNotFoundError();
    }
    order.status = status;
    order.description = description;
    order.deliveryManId = new UniqueEntityID(deliveryManId);
    order.recipientId = new UniqueEntityID(recipientId);

    await this.orderRepository.update(order);
  }
}
