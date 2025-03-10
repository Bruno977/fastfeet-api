import { PaginationParams } from 'src/core/repositories/pagination-params';
import { RecipientRepository } from 'src/domain/deliveries/application/repositories/recipient-repository';
import { Recipient } from 'src/domain/deliveries/enterprise/entities/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  public recipients: Recipient[] = [];

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient);
  }

  async findById(recipientId: string): Promise<Recipient | null> {
    const recipient = this.recipients.find(
      (r) => r.id.toString() === recipientId,
    );
    return recipient || null;
  }
  async findByCpf(cpf: string): Promise<Recipient | null> {
    const recipient = this.recipients.find((r) => r.cpf.toString() === cpf);
    return recipient || null;
  }
  async update(recipient: Recipient): Promise<void> {
    const recipientIndex = this.recipients.findIndex(
      (r) => r.id.toString() === recipient.id.toString(),
    );
    this.recipients[recipientIndex] = recipient;
  }
  async findMany({ page }: PaginationParams): Promise<Recipient[]> {
    const recipients = this.recipients.slice((page - 1) * 20, page * 20);
    return recipients;
  }

  async delete(id: string) {
    this.recipients = this.recipients.filter(
      (recipient) => recipient.id.toString() !== id,
    );
  }
}
