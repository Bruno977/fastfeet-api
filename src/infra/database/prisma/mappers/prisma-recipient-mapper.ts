import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';
import { Prisma, Recipient as RecipientPrisma } from '@prisma/client';
import { Address } from 'src/domain/deliveries/enterprise/entities/address';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';
export class PrismaRecipientMapper {
  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf,
      city: recipient.address.city,
      latitude: recipient.address.latitude,
      longitude: recipient.address.longitude,
      street: recipient.address.street,
      number: recipient.address.number,
      neighborhood: recipient.address.neighborhood,
      state: recipient.address.state,
      zipCode: recipient.address.zipCode,
    };
  }
  static toDomain(recipient: RecipientPrisma): Recipient {
    const address = Address.create({
      city: recipient.city,
      latitude: recipient.latitude.toNumber(),
      longitude: recipient.longitude.toNumber(),
      street: recipient.street,
      number: recipient.number,
      neighborhood: recipient.neighborhood,
      state: recipient.state,
      zipCode: recipient.zipCode,
    });

    return Recipient.create(
      {
        name: recipient.name,
        cpf: recipient.cpf,
        address: address,
      },
      new UniqueEntityID(recipient.id),
    );
  }
}
