import { RoleProps } from 'src/core/types/role';
import { HashGenerator } from '../cryptography/hash-generator';
import { DeliveryManRepository } from '../repositories/delivery-man-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface UpdateDeliveryManUseCaseRequest {
  id: string;
  name: string;
  password?: string;
  role: RoleProps;
}

export class UpdateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({ name, password, role, id }: UpdateDeliveryManUseCaseRequest) {
    if (role !== 'ADMIN') {
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
