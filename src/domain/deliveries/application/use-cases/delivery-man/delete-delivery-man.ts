import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Authorization } from '../../auth/authorization';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { RoleProps } from 'src/core/types/role';
import { Injectable } from '@nestjs/common';

interface DeleteDeliveryManUseCaseRequest {
  id: string;
  role: RoleProps;
}

@Injectable()
export class DeleteDeliveryManUseCase {
  constructor(private deliveryManRepository: DeliveryManRepository) {}
  async execute({ id, role }: DeleteDeliveryManUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'delete-delivery-man');
    if (!isAdmin) {
      throw new NotAllowedError();
    }
    const deliveryMan = await this.deliveryManRepository.findById(id);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    await this.deliveryManRepository.delete(id);
  }
}
