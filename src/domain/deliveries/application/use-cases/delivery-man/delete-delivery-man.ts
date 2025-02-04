import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { AuthorizationService } from 'src/core/services/authorization-service';

interface DeleteDeliveryManUseCaseRequest {
  id: string;
  role: RoleProps;
}

export class DeleteDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ id, role }: DeleteDeliveryManUseCaseRequest) {
    AuthorizationService.verifyRole({ role, allowedRole: 'ADMIN' });

    const deliveryMan = await this.deliveryManRepository.findById(id);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    await this.deliveryManRepository.delete(id);
  }
}
