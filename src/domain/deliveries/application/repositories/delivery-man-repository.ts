import { PaginationParams } from 'src/core/repositories/pagination-params';
import { DeliveryMan } from '../../enterprise/entities/delivery-man';

export abstract class DeliveryManRepository {
  abstract create(deliveryMan: DeliveryMan): Promise<void>;
  abstract update(deliveryMan: DeliveryMan): Promise<void>;
  abstract findByCpf(cpf: string): Promise<DeliveryMan | null>;
  abstract findById(id: string): Promise<DeliveryMan | null>;
  abstract findMany(params: PaginationParams): Promise<DeliveryMan[]>;
  abstract delete(id: string): Promise<void>;
}
