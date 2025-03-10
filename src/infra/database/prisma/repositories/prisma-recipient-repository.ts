import { Injectable } from '@nestjs/common';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';
import { PrismaService } from '../prisma.service';
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';
import { PaginationParams } from 'src/core/repositories/pagination-params';

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}
  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient);
    await this.prisma.recipient.create({ data });
  }
  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      skip: (page - 1) * 20,
      take: 20,
    });
    return recipients.map((recipient) =>
      PrismaRecipientMapper.toDomain(recipient),
    );
  }
  async findById(recipientId: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }
  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { cpf },
    });

    if (!recipient) {
      return null;
    }

    return PrismaRecipientMapper.toDomain(recipient);
  }
  async update(order: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(order);
    await this.prisma.recipient.update({
      where: { id: data.id },
      data,
    });
  }
  async delete(id: string): Promise<void> {
    await this.prisma.recipient.delete({ where: { id } });
  }
}
