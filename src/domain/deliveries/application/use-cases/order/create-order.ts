import { Order } from 'src/domain/deliveries/enterprise/entities/order';
import { OrderRepository } from '../../repositories/order-repository';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { RecipientRepository } from '../../repositories/recipient-repository';
import { RecipientNotFoundError } from '../errors/recipient-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
interface CreateOrderUseCaseRequest {
  description: string;
  deliveryManId: string;
  recipientId: string;
  role: RoleProps;
}
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
    private recipientRepository: RecipientRepository,
  ) {}
  async execute({
    description,
    deliveryManId,
    recipientId,
    role,
  }: CreateOrderUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'create-order');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }
    const recipient = await this.recipientRepository.findById(recipientId);
    if (!recipient) {
      throw new RecipientNotFoundError();
    }
    const order = Order.create({
      status: 'NEW',
      description,
      deliveryManId: new UniqueEntityID(deliveryManId),
      recipientId: new UniqueEntityID(recipientId),
    });
    await this.orderRepository.create(order);
  }
}
