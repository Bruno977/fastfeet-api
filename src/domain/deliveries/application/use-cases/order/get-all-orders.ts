import { RoleProps } from 'src/core/types/role';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { OrderRepository } from '../../repositories/order-repository';
import { Injectable } from '@nestjs/common';

interface GetAllOrdersRequest {
  role: RoleProps;
  page: number;
}
@Injectable()
export class GetAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ role, page }: GetAllOrdersRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-all-orders');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const orders = await this.orderRepository.findMany({ page });
    return { orders };
  }
}
