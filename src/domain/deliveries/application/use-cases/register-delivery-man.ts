import { DeliveryMan } from '../../enterprise/entities/delivery-man';
import { HashGenerator } from '../cryptography/hash-generator';
import { RegisterDeliveryRepository } from '../repositories/register-delivery-repository';
import { CpfAlreadyExistsError } from './errors/cpf-already-exists';

interface RegisterDeliveryManUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

export class RegisterDeliveryManUseCase {
  constructor(
    private deliveryManRepository: RegisterDeliveryRepository,
    private hashGenerator: HashGenerator,
  ) {}
  async execute({ name, cpf, password }: RegisterDeliveryManUseCaseRequest) {
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
