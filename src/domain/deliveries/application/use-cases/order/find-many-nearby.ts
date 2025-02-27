import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { OrderRepository } from '../../repositories/order-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface findManyNearbyUseCaseProps {
  deliveryManLatitude: number;
  deliveryManLongitude: number;
  deliveryManId: string;
  page: number;
}

@Injectable()
export class FindManyNearbyUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliveryManRepository: DeliveryManRepository,
  ) {}

  async execute({
    deliveryManLatitude,
    deliveryManLongitude,
    deliveryManId,
    page,
  }: findManyNearbyUseCaseProps) {
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);

    if (!deliveryMan) {
      throw new NotAllowedError();
    }
    console.log(page);
    const ordersDeliveryMan =
      await this.orderRepository.findAllByUser(deliveryManId);

    const orders = await this.orderRepository.findManyNearby({
      deliveryManId,
      latitude: deliveryManLatitude,
      longitude: deliveryManLongitude,
      orders: ordersDeliveryMan,
      page,
    });

    return {
      orders,
    };
  }
}
