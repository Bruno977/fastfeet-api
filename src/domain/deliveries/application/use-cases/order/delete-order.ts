import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface DeleteOrderRequest {
  id: string;
  role: RoleProps;
}

export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ id, role }: DeleteOrderRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    await this.orderRepository.delete(id);
  }
}
