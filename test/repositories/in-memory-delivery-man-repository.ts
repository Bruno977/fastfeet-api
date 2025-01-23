import { RegisterDeliveryRepository } from 'src/domain/deliveries/application/repositories/register-delivery-repository';
import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';

export class InMemoryDeliveryManRepository
  implements RegisterDeliveryRepository
{
  public deliveryMan: DeliveryMan[] = [];

  async create(deliveryMan: DeliveryMan) {
    this.deliveryMan.push(deliveryMan);
    return Promise.resolve();
  }
  async findByCpf(cpf: string) {
    const deliveryMan =
      this.deliveryMan.find((deliveryMan) => deliveryMan.cpf === cpf) || null;
    return Promise.resolve(deliveryMan);
  }
}
