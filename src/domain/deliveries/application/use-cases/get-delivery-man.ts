import { RegisterDeliveryRepository } from '../repositories/register-delivery-repository';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';

interface GetDeliveryManUseCaseRequest {
  cpf: string;
}
export class GetDeliveryManUseCase {
  constructor(private deliveryManRepository: RegisterDeliveryRepository) {}
  async execute({ cpf }: GetDeliveryManUseCaseRequest) {
    const deliveryMan = await this.deliveryManRepository.findByCpf(cpf);
    if (!deliveryMan) {
      throw new ResourceNotFoundError();
    }
    return {
      deliveryMan,
    };
  }
}
