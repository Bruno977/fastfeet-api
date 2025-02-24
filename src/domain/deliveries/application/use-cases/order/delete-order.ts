import { RoleProps } from 'src/core/types/role';
import { OrderRepository } from '../../repositories/order-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface DeleteOrderRequest {
  id: string;
  role: RoleProps;
}
@Injectable()
export class DeleteOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ id, role }: DeleteOrderRequest) {
    const isAdmin = Authorization.hasPermission(role, 'delete-order');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new ResourceNotFoundError();
    }
    await this.orderRepository.delete(id);
  }
}
