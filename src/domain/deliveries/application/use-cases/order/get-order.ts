import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface GetOrderUseCaseRequest {
  orderId: string;
  role: RoleProps;
}

export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ orderId, role }: GetOrderUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    return {
      order,
    };
  }
}
