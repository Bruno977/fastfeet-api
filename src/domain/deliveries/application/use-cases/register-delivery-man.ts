import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { DeliveryMan } from '../../enterprise/entities/delivery-man';
import { HashGenerator } from '../cryptography/hash-generator';
import { DeliveryManRepository } from '../repositories/delivery-man-repository';
import { CpfAlreadyExistsError } from './errors/cpf-already-exists';
import { RoleProps } from 'src/core/types/role';

interface RegisterDeliveryManUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
  role: RoleProps;
}

export class RegisterDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({
    name,
    cpf,
    password,
    role,
  }: RegisterDeliveryManUseCaseRequest) {
    if (role !== 'ADMIN') {
      throw new NotAllowedError();
    }
    const deliveryManWithSameCpf =
      await this.deliveryManRepository.findByCpf(cpf);

    if (deliveryManWithSameCpf) {
      throw new CpfAlreadyExistsError();
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryMan = DeliveryMan.create({
      name,
      cpf,
      password: hashedPassword,
    });

    await this.deliveryManRepository.create(deliveryMan);

    return {
      deliveryMan,
    };
  }
}
