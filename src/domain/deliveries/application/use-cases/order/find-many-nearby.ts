import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { OrderRepository } from '../../repositories/order-repository';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Injectable } from '@nestjs/common';

interface findManyNearbyUseCaseProps {
  deliveryManLatitude: number;
  deliveryManLongitude: number;
  deliveryManId: string;
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
  }: findManyNearbyUseCaseProps) {
    const deliveryMan =
      await this.deliveryManRepository.findById(deliveryManId);

    if (!deliveryMan) {
      throw new NotAllowedError();
    }
    const ordersDeliveryMan =
      await this.orderRepository.findAllByUser(deliveryManId);

    // if (!ordersDeliveryMan) {
    //   return [];
    // }

    const orders = await this.orderRepository.findManyNearby({
      deliveryManId,
      latitude: deliveryManLatitude,
      longitude: deliveryManLongitude,
      orders: ordersDeliveryMan,
    });

    return {
      orders,
    };
  }
}
