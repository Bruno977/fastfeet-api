import { DeliveryMan } from './../../enterprise/entities/delivery-man';

export abstract class RegisterDeliveryRepository {
  abstract create(deliveryMan: DeliveryMan): Promise<void>;
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>;
}
