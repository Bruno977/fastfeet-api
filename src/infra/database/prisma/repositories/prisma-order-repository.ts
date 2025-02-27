import { Injectable } from '@nestjs/common';
import {
  findManyNearbyProps,
  OrderRepository,
  updateOrderStatusProps,
} from 'src/domain/deliveries/application/repositories/order-repository';
import { Order } from 'src/domain/deliveries/enterprise/entities/order';
import { PrismaService } from '../prisma.service';
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper';
import { Prisma, Recipient as RecipientPrisma } from '@prisma/client';
import { PaginationParams } from 'src/core/repositories/pagination-params';

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
      },
    });
  }
  async findMany({ page }: PaginationParams): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      skip: (page - 1) * 20,
      take: 20,
    });
    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }
  async findAllByUser(
    userId: string,
    params?: PaginationParams,
  ): Promise<Order[]> {
    const skip = params?.page ? (params.page - 1) * 20 : undefined;
    const take = params?.page ? 20 : undefined;
    const orders = await this.prisma.order.findMany({
      where: { user_id: userId },
      skip: skip,
      take: take,
    });
    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }
  async findManyNearby(params: findManyNearbyProps): Promise<Order[]> {
    const latitude = Number(params.latitude);
    const longitude = Number(params.longitude);
    const userOrders = params.orders.map((order) =>
      PrismaOrderMapper.toPrisma(order),
    );
    const recipientIds = [
      ...new Set(userOrders.map((order) => order.recipient_id)),
    ];
    const page = params.page || 1;
    const offset = (page - 1) * 20;

    const nearbyRecipients = await this.prisma.$queryRaw<RecipientPrisma[]>`
      SELECT id FROM recipient
      WHERE id IN (${Prisma.join(recipientIds)})
      AND ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10 
      LIMIT ${20} OFFSET ${offset}
    `;

    const nearbyRecipientIds = nearbyRecipients.map(
      (recipient) => recipient.id,
    );

    const nearbyOrders = userOrders.filter((order) =>
      nearbyRecipientIds.includes(order.recipient_id),
    );

    return nearbyOrders.map((order) => PrismaOrderMapper.toDomain(order));
  }
}
