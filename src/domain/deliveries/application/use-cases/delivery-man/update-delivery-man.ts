import { RoleProps } from 'src/core/types/role';
import { HashGenerator } from '../../cryptography/hash-generator';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Authorization } from '../../auth/authorization';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface UpdateDeliveryManUseCaseRequest {
  id: string;
  name: string;
  password?: string;
  role: RoleProps;
}
@Injectable()
export class UpdateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({ name, password, role, id }: UpdateDeliveryManUseCaseRequest) {
    const isAdmin = Authorization.hasPermission(role, 'update-delivery-man');
    if (!isAdmin) {
      throw new NotAllowedError();
    }

    const deliveryMan = await this.deliveryManRepository.findById(id);

    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password);
      deliveryMan.password = hashedPassword;
    }

    deliveryMan.name = name;

    await this.deliveryManRepository.update(deliveryMan);
  }
}
