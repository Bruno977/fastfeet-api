import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';
import { Prisma, User } from '@prisma/client';
import { UniqueEntityID } from 'src/core/entities/unique-entity-id';

export class PrismaDeliveryManMapper {
  static toDomain(deliveryMan: User): DeliveryMan {
    return DeliveryMan.create(
      {
        cpf: deliveryMan.cpf,
        name: deliveryMan.name,
        password: deliveryMan.password,
        role: deliveryMan.role,
      },
      new UniqueEntityID(deliveryMan.id),
    );
  }
  static toPrisma(deliveryMan: DeliveryMan): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryMan.id.toString(),
      name: deliveryMan.name,
      cpf: deliveryMan.cpf,
      password: deliveryMan.password,
      role: deliveryMan.role,
    };
  }
}
