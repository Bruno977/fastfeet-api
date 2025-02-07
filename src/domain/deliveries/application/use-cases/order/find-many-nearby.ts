import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { OrderRepository } from '../../repositories/order-repository';
import { DeliveryManNotFoundError } from '../errors/delivery-man-not-found-error';

interface findManyNearbyUseCaseProps {
  deliveryManLatitude: number;
  deliveryManLongitude: number;
  deliveryManId: string;
}

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
      throw new DeliveryManNotFoundError();
    }
    const ordersDeliveryMan =
      await this.orderRepository.findAllByUser(deliveryManId);

    const order = await this.orderRepository.findManyNearby({
      deliveryManId,
      latitude: deliveryManLatitude,
      longitude: deliveryManLongitude,
      orders: ordersDeliveryMan,
    });

    return {
      order,
    };
  }
}
