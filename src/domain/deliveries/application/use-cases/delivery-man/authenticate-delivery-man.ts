import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';
import { HashComparer } from '../../cryptography/hash-comparer';
import { Encrypter } from '../../cryptography/encrypter';
interface AuthenticateDeliveryManUseCaseRequest {
  cpf: string;
  password: string;
}
export class AuthenticateDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashCompare: HashComparer,
    private encrypter: Encrypter,
  ) {}
  async execute({ cpf, password }: AuthenticateDeliveryManUseCaseRequest) {
    const deliveryMan = await this.deliveryManRepository.findByCpf(cpf);
    if (!deliveryMan) {
      throw new WrongCredentialsError();
    }
    const isSamePassword = await this.hashCompare.compare(
      password,
      deliveryMan.password,
    );

    if (!isSamePassword) {
      throw new WrongCredentialsError();
    }
    const accessToken = await this.encrypter.encrypt({
      sub: deliveryMan.id.toString(),
      role: deliveryMan.role,
    });
    return {
      accessToken,
    };
  }
}
