import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface DeleteOrderRequest {
  id: string;
  role: RoleProps;
}

export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ id, role }: DeleteOrderRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    await this.orderRepository.delete(id);
  }
}
