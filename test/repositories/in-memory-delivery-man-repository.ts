import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public deliveryMan: DeliveryMan[] = [];

  async create(deliveryMan: DeliveryMan) {
    this.deliveryMan.push(deliveryMan);
  }
  async findByCpf(cpf: string) {
    const deliveryMan =
      this.deliveryMan.find((deliveryMan) => deliveryMan.cpf === cpf) || null;
    return deliveryMan;
  }
  async findById(id: string) {
    const deliveryMan =
      this.deliveryMan.find(
        (deliveryMan) => deliveryMan.id.toString() === id,
      ) || null;
    return deliveryMan;
  }
  async update(deliveryMan: DeliveryMan) {
    const index = this.deliveryMan.findIndex(
      (deliveryMan) => deliveryMan.id === deliveryMan.id,
    );
    this.deliveryMan[index] = deliveryMan;
  }
  async delete(id: string) {
    this.deliveryMan = this.deliveryMan.filter(
      (deliveryMan) => deliveryMan.id.toString() !== id,
    );
  }
}
