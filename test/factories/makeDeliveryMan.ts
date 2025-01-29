import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import {
  DeliveryMan,
  DeliveryManProps,
} from 'src/domain/deliveries/enterprise/entities/delivery-man';

export function makeDeliveryMan(
  override: Partial<DeliveryManProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = DeliveryMan.create(
    {
      cpf: '123456789',
      name: faker.person.fullName(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  );

  return deliveryman;
}
