import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface GetOrderUseCaseRequest {
  orderId: string;
  role: RoleProps;
}

export class GetOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ orderId, role }: GetOrderUseCaseRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    return {
      order,
    };
  }
}
