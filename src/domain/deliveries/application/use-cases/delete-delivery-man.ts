import { RoleProps } from 'src/core/types/role';
import { DeliveryManRepository } from '../repositories/delivery-man-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface DeleteDeliveryManUseCaseRequest {
  id: string;
  role: RoleProps;
}

export class DeleteDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ id, role }: DeleteDeliveryManUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const deliveryMan = await this.deliveryManRepository.findById(id);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    await this.deliveryManRepository.delete(id);
  }
}
