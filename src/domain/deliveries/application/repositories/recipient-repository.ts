import { Recipient } from '../../enterprise/entities/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findById(recipientId: string): Promise<Recipient | null>;
  abstract update(order: Recipient): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
