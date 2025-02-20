import { Injectable } from '@nestjs/common';
import {
  findManyNearbyProps,
  OrderRepository,
  updateOrderStatusProps,
} from 'src/domain/deliveries/application/repositories/order-repository';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}
  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await this.prisma.order.create({ data });
  }
  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      return null;
    }
    return PrismaOrderMapper.toDomain(order);
  }
  async delete(id: string): Promise<void> {
    await this.prisma.order.delete({ where: { id } });
  }
  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);
    await this.prisma.order.update({
      where: { id: data.id },
      data,
    });
  }
  async updateOrderStatus(params: updateOrderStatusProps): Promise<void> {
    await this.prisma.order.update({
      where: { id: params.orderId },
      data: {
        status: params.status,
        attachment: {
          connect: {
            id: params.attachmentId?.toString(),
          },
        },
      },
    });
  }
  async findAllByUser(id: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: { id },
    });
    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }
  async findManyNearby(params: findManyNearbyProps): Promise<Order[]> {
    const orders = await this.prisma.$queryRaw<Order[]>`
    SELECT * from orders
    WHERE ( 6371 * acos( cos( radians(${params.latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${params.longitude}) ) + sin( radians(${params.latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
  `;

    return orders;
  }
}
