import { OrderRepository } from '../../repositories/order-repository';
import { DeliveryManRepository } from '../../repositories/delivery-man-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface GetOrderByUserUseCaseRequest {
  deliveryManId: string;
  currentUserId: string;
  page: number;
}

@Injectable()
export class GetOrderByUserUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}
  async execute({
    deliveryManId,
    currentUserId,
    page,
  }: GetOrderByUserUseCaseRequest) {
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);
    if (!deliveryMan) {
      throw new DeliveryManNotFoundError();
    }
    if (deliveryMan.id.toString() !== currentUserId) {
      throw new NotAllowedError();
    }

    const orders = await this.orderRepository.findAllByUser(deliveryManId, {
      page,
    });
    return { orders };
  }
}
