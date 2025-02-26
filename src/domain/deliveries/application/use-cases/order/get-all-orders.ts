import { RoleProps } from 'src/core/types/role';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { OrderRepository } from '../../repositories/order-repository';

interface GetAllOrdersRequest {
  role: RoleProps;
}
export class GetAllOrdersUseCase {
  constructor(private orderRepository: OrderRepository) {}
  async execute({ role }: GetAllOrdersRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-all-orders');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const orders = await this.orderRepository.findMany();
    return { orders };
  }
}
