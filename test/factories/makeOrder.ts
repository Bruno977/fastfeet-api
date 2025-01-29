import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import {
  Order,
  OrderProps,
} from 'src/domain/deliveries/enterprise/entities/order';

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      deliveryManId: new UniqueEntityID(),
      description: faker.lorem.text(),
      status: 'AWAITING_PICKUP',
      ...override,
    },
    id,
  );

  return order;
}
