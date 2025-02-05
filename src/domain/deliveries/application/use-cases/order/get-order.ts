import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface GetOrderUseCaseRequest {
  orderId: string;
  role: RoleProps;
}

export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ orderId, role }: GetOrderUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-order');
    if (!isAdmin) {
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
