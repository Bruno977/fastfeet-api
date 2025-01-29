import { Order } from 'src/domain/deliveries/enterprise/entities/order';
import { OrderRepository } from '../../repositories/order-repository';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { RoleProps } from 'src/core/types/role';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
interface CreateOrderUseCaseRequest {
  description: string;
  deliveryManId: string;
  role: RoleProps;
}
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}
  async execute({
    description,
    deliveryManId,
    role,
  }: CreateOrderUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }
    const order = Order.create({
      status: 'NEW',
      description,
      deliveryManId: new UniqueEntityID(deliveryManId),
    });
    await this.orderRepository.create(order);
  }
}
