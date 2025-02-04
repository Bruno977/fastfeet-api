import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface GetDeliveryManUseCaseRequest {
  id: string;
  role: RoleProps;
}
export class GetDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ id, role }: GetDeliveryManUseCaseRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });

    const deliveryMan = await this.deliveryManRepository.findById(id);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    return {
      deliveryMan,
    };
  }
}
