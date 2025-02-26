import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface GetAllDeliveryManRequest {
  role: RoleProps;
}
export class GetAllDeliveryMen {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ role }: GetAllDeliveryManRequest) {
    const isAdmin = Authorization.hasPermission(role, 'get-all-delivery-man');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const deliveryMen = await this.deliveryManRepository.findMany();
    return { deliveryMen };
  }
}
