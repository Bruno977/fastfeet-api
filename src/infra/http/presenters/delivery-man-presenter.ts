import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';

export class DeliveryManPresenter {
  static toHTTP(deliveryMan: DeliveryMan) {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      cpf: deliveryMan.cpf,
      role: deliveryMan.role,
    };
  }
}
