import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';

interface GetDeliveryManUseCaseRequest {
  id: string;
  role: RoleProps;
}
export class GetDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ id, role }: GetDeliveryManUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const deliveryMan = await this.deliveryManRepository.findById(id);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    return {
      deliveryMan,
    };
  }
}
