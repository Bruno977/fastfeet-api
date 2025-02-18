import { Injectable } from '@nestjs/common';
import { DeliveryManRepository } from 'src/domain/deliveries/application/repositories/delivery-man-repository';
import { DeliveryMan } from 'src/domain/deliveries/enterprise/entities/delivery-man';
import { PrismaService } from '../prisma.service';
import { PrismaDeliveryManMapper } from '../mappers/prisma-delivery-man-mapper';

@Injectable()
export class PrismaDeliveryManRepository implements DeliveryManRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
    await this.prisma.user.create({ data });
  }
  async update(deliveryMan: DeliveryMan): Promise<void> {
    const data = PrismaDeliveryManMapper.toPrisma(deliveryMan);
    await this.prisma.user.update({ where: { id: data.id }, data });
  }
  async findByCpf(cpf: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: { cpf },
    });

    if (!deliveryMan) {
      return null;
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan);
  }
  async findById(id: string): Promise<DeliveryMan | null> {
    const deliveryMan = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!deliveryMan) {
      return null;
    }

    return PrismaDeliveryManMapper.toDomain(deliveryMan);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
