import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
import { faker } from '@faker-js/faker';
import {
  Recipient,
  RecipientProps,
} from 'src/domain/deliveries/enterprise/entities/recipient';
import { Address } from 'src/domain/deliveries/enterprise/entities/address';

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create({
    city: faker.location.city(),
    neighborhood: faker.location.streetAddress(),
    number: faker.location.buildingNumber(),
    state: faker.location.state(),
    street: faker.location.street(),
    zipCode: faker.location.zipCode(),
  });
  const recipient = Recipient.create(
    {
      cpf: '123456789',
      name: faker.person.firstName(),
      address,
      ...override,
    },
    id,
  );

  return recipient;
}
