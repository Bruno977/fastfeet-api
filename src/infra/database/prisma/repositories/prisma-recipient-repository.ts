import { Injectable } from '@nestjs/common';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  create(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findById(recipientId: string): Promise<Recipient | null> {
    throw new Error('Method not implemented.');
  }
  update(order: Recipient): Promise<void> {
    throw new Error('Method not implemented.');
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
